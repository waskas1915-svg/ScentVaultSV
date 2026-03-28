import json

try:
    with open("products.json", "r") as file:
        products = json.load(file)

    for product in products:
        base_id = str(product["id"])

        for variant in product["variants"]:
            size = variant["size"]

            # Extract number from size (e.g., "3ML" → "3")
            size_number = ''.join(filter(str.isdigit, size))

            if size_number:
                variant["id"] = int(base_id + size_number)
            else:
                variant["id"] = int(base_id + "0")  # fallback

    with open("products.json", "w") as file:
        json.dump(products, file, indent=2)

    print("✅ Variant IDs generated using size!")

except Exception as e:
    print("❌ Error:", e)