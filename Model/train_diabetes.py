import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import RandomOverSampler
from tensorflow.keras.callbacks import EarlyStopping

# ---- 1) Load data ----
df = pd.read_csv('diabetes.csv')
print("Dataset shape:", df.shape)
print(df['Outcome'].value_counts())

# ---- 2) Plot histograms ----
for label in df.columns.drop('Outcome'):
    plt.figure(figsize=(6,3))
    plt.hist(df[df['Outcome'] == 1][label], label='Diabetes (1)', alpha=0.6, density=True, bins=15)
    plt.hist(df[df['Outcome'] == 0][label], label='No Diabetes (0)', alpha=0.6, density=True, bins=15)
    plt.title(label)
    plt.xlabel(label)
    plt.ylabel('Probability density')
    plt.legend()
    plt.tight_layout()
    plt.show()

# ---- 3) Prepare X and y ----
X = df.drop(columns=['Outcome']).values
y = df['Outcome'].values

# ---- 4) Split the data ----
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.4, random_state=0, stratify=y)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=0, stratify=y_temp)

# ---- 5) Oversample training data ----
over = RandomOverSampler(random_state=0)
X_train_res, y_train_res = over.fit_resample(X_train, y_train)

# ---- 6) Scale features ----
scaler = StandardScaler()
X_train_res = scaler.fit_transform(X_train_res)
X_val = scaler.transform(X_val)
X_test = scaler.transform(X_test)

# ---- 7) Build model ----
model = tf.keras.Sequential([
    tf.keras.layers.Dense(16, activation='relu', input_shape=(X_train_res.shape[1],)),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss=tf.keras.losses.BinaryCrossentropy(),
    metrics=['accuracy']
)

model.summary()

# ---- 8) Add early stopping ----
early = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True)

# ---- 9) Train the model ----
print("\n🧠 Training the model...\n")
history = model.fit(
    X_train_res, y_train_res,
    validation_data=(X_val, y_val),
    epochs=300,
    batch_size=16,
    callbacks=[early],
    verbose=2
)

# ---- ✅ 10) Show final accuracies ----
train_acc = history.history['accuracy'][-1]
val_acc = history.history['val_accuracy'][-1]

print(f"\n✅ Training accuracy: {train_acc*100:.2f}%")
print(f"✅ Validation accuracy: {val_acc*100:.2f}%")

# ---- 11) Evaluate on test data ----
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"✅ Test accuracy: {test_acc*100:.2f}%")

# ---- 12) Predictions ----
probs = model.predict(X_test)
preds = (probs.flatten() > 0.5).astype(int)

print("\nFirst 10 predictions (0=No Diabetes, 1=Diabetes):")
for i in range(min(10, len(preds))):
    print(f"Sample {i+1}: Predicted={preds[i]}, True={y_test[i]}, Probability={probs[i][0]:.3f}")

# ---- 13) Save the model and scaler ----
print("\n💾 Saving model and scaler...")
model.save('diabetes_model.h5')
joblib.dump(scaler, 'scaler.pkl')
print("✅ Model saved as 'diabetes_model.h5'")
print("✅ Scaler saved as 'scaler.pkl'")
