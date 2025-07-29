import json

# 1. TXT dosyasını oku
with open("kategoriler.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

result = {}

# 2. Satır satır işle
for line in lines:
    line = line.strip()
    if not line:
        continue
    if "wc" in line:
        parts = line.split("wc")
        category = parts[0].strip().lower()
        value = parts[1].replace("=", "").strip()
        result[category] = value

# 3. JSON dosyasına yaz
with open("categories.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=4)

print("✅ JSON dosyası oluşturuldu: categories.json")
