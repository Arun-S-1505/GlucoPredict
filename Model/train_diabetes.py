import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import tensorflow as tf
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from imblearn.over_sampling import RandomOverSampler
from tensorflow.keras.callbacks import EarlyStopping

# ---- 1) Load data ----
df = pd.read_csv('diabetes.csv')
print("Dataset shape:", df.shape)
print("Original outcome distribution:")
print(df['Outcome'].value_counts())

# ---- 2) Create 3-class labels based on glucose levels ----
def create_three_classes(glucose, original_outcome):
    """
    Create 3 classes based on medical criteria:
    0 = Normal (glucose < 100)
    1 = Pre-diabetic/Borderline (glucose 100-125)
    2 = Diabetic (glucose >= 126 OR original diabetic)
    """
    if original_outcome == 1:  # Already diagnosed diabetic
        return 2
    elif glucose < 100:  # Normal
        return 0
    elif glucose <= 125:  # Pre-diabetic range
        return 1
    else:  # Glucose > 125, consider diabetic
        return 2

df['Outcome_3class'] = df.apply(lambda row: create_three_classes(row['Glucose'], row['Outcome']), axis=1)

print("\nNew 3-class distribution:")
print(df['Outcome_3class'].value_counts())
print("\nClass mapping:")
print("0 = Normal (glucose < 100)")
print("1 = Pre-diabetic/Borderline (glucose 100-125)")
print("2 = Diabetic (glucose >= 126 OR original diabetic)")

# ---- 3) Plot histograms for 3 classes ----
for label in df.columns.drop(['Outcome', 'Outcome_3class']):
    plt.figure(figsize=(8,4))
    for class_val, class_name in [(0, 'Normal'), (1, 'Pre-diabetic'), (2, 'Diabetic')]:
        plt.hist(df[df['Outcome_3class'] == class_val][label],
                label=f'{class_name} ({class_val})',
                alpha=0.6, density=True, bins=15)
    plt.title(f'{label} - 3 Class Distribution')
    plt.xlabel(label)
    plt.ylabel('Probability density')
    plt.legend()
    plt.tight_layout()
    plt.show()

# ---- 4) Prepare X and y ----
X = df.drop(columns=['Outcome', 'Outcome_3class']).values
y = df['Outcome_3class'].values

# ---- 5) Convert labels to one-hot encoding ----
from tensorflow.keras.utils import to_categorical
y_categorical = to_categorical(y, num_classes=3)

# ---- 6) Split the data ----
X_train, X_temp, y_train, y_temp = train_test_split(X, y_categorical, test_size=0.4, random_state=0, stratify=y)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=0, stratify=np.argmax(y_temp, axis=1))

# ---- 7) Oversample training data ----
over = RandomOverSampler(random_state=0)
X_train_res, y_train_res_indices = over.fit_resample(X_train, np.argmax(y_train, axis=1))
y_train_res = to_categorical(y_train_res_indices, num_classes=3)

# ---- 8) Scale features ----
scaler = StandardScaler()
X_train_res = scaler.fit_transform(X_train_res)
X_val = scaler.transform(X_val)
X_test = scaler.transform(X_test)

# ---- 9) Build model for 3-class classification ----
model = tf.keras.Sequential([
    tf.keras.layers.Dense(32, activation='relu', input_shape=(X_train_res.shape[1],)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(24, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(3, activation='softmax')  # 3 output classes
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss=tf.keras.losses.CategoricalCrossentropy(),
    metrics=['accuracy']
)

model.summary()

# ---- 10) Add early stopping ----
early = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=20, restore_best_weights=True)

# ---- 11) Train the model ----
print("\n🧠 Training the 3-class diabetes model...\n")
history = model.fit(
    X_train_res, y_train_res,
    validation_data=(X_val, y_val),
    epochs=300,
    batch_size=16,
    callbacks=[early],
    verbose=2
)

# ---- ✅ 12) Show final accuracies ----
train_acc = history.history['accuracy'][-1]
val_acc = history.history['val_accuracy'][-1]

print(f"\n✅ Training accuracy: {train_acc*100:.2f}%")
print(f"✅ Validation accuracy: {val_acc*100:.2f}%")

# ---- 13) Evaluate on test data ----
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"✅ Test accuracy: {test_acc*100:.2f}%")

# ---- 14) Predictions ----
probs = model.predict(X_test)
preds = np.argmax(probs, axis=1)
true_labels = np.argmax(y_test, axis=1)

print("\nFirst 10 predictions (0=Normal, 1=Pre-diabetic, 2=Diabetic):")
class_names = ['Normal', 'Pre-diabetic', 'Diabetic']
for i in range(min(10, len(preds))):
    pred_class = class_names[preds[i]]
    true_class = class_names[true_labels[i]]
    prob_str = f"[{probs[i][0]:.3f}, {probs[i][1]:.3f}, {probs[i][2]:.3f}]"
    print(f"Sample {i+1}: Predicted={pred_class}, True={true_class}, Probabilities={prob_str}")

# ---- 15) Confusion Matrix ----
from sklearn.metrics import confusion_matrix, classification_report
print("\n📊 Confusion Matrix:")
cm = confusion_matrix(true_labels, preds)
print("Predicted: Normal, Pre-diabetic, Diabetic")
print("Actual:")
for i, row in enumerate(cm):
    print(f"  {class_names[i]}: {row}")

print("\n📈 Classification Report:")
print(classification_report(true_labels, preds, target_names=class_names))
print("\n💾 Saving 3-class model and scaler...")
model.save('diabetes_model.h5')
joblib.dump(scaler, 'scaler.pkl')
print("✅ 3-class model saved as 'diabetes_model.h5'")
print("✅ Scaler saved as 'scaler.pkl'")
print("\n🎯 Model now predicts 3 classes:")
print("   0 = Normal (low diabetes risk)")
print("   1 = Pre-diabetic/Borderline (moderate risk)")
print("   2 = Diabetic (high risk)")
