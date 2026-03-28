import json

product_image_map = {
    "Fahrenheit": "./images/farenheith.png",
    "Gentleman Reserve Privée": "./images/GentlemanReservePrivee.png",
    "Gentleman Society Ambrée": "./images/GentlemanSocietyAmbree.png"
}

try:
    with open("products.json", "r") as file:
        products = json.load(file)

    for product in products:
        base_image = product_image_map.get(product["name"])

        if not base_image:
            continue

        # ✅ Product image
        product["image"] = base_image

        # ✅ Variant image (replace with _decant)
        variant_image = base_image.replace(".png", "_decant.png")

        for variant in product.get("variants", []):
            variant["image"] = variant_image

    with open("products.json", "w") as file:
        json.dump(products, file, indent=2)

    print("✅ Product and variant images updated!")

except Exception as e:
    print("❌ Error:", e)