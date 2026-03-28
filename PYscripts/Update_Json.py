import json

try:
    with open("products.json", "r") as file:
        products = json.load(file)

    grouped = {}

    for product in products:
        name = product["name"]

        # Create base product if it doesn't exist
        if name not in grouped:
            grouped[name] = {
                "id": product["id"],
                "name": name,
                "image": product.get("image", ""),
                "description": product.get("description", ""),
                "variants": []
            }

        # Add variant for every product
        variant = {
            "size": product.get("size"),
            "price": product.get("price"),
            "in_stock": product.get("in_stock", True)
        }

        grouped[name]["variants"].append(variant)

    # Convert to list
    new_products = list(grouped.values())

    # Save updated JSON
    with open("products.json", "w") as file:
        json.dump(new_products, file, indent=2)

    print("✅ All products converted to variant structure!")

except Exception as e:
    print("❌ Error:", e)