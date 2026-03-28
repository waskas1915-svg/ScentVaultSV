import json

try:
    with open("products.json", "r") as file:
        products = json.load(file)

    for product in products:
        product_image = product.get("image", "")

        for variant in product["variants"]:
            variant["image"] = product_image

    with open("products.json", "w") as file:
        json.dump(products, file, indent=2)

    print("✅ Images added to all variants!")

except Exception as e:
    print("❌ Error:", e)