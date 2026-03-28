import json

image_map = {
    "Fahrenheit": "./images/farenheith.png",
    "Gentleman Reserve Privée": "./images/GentlemanReservePrivee.png",
    "Gentleman Society Ambrée": "./images/GentlemanSocietyAmbree.png"
}

try:
    with open("products.json", "r") as file:
        products = json.load(file)

    for product in products:
        base_image = image_map.get(product["name"])

        if not base_image:
            continue

        # Update main product image
        product["image"] = base_image

        # Update each variant image
        for variant in product.get("variants", []):
            size = variant.get("size", "").lower()

            # Remove "ml" spaces just in case and format
            size_clean = size.replace(" ", "").lower()

            variant["image"] = base_image.replace(
                ".png", f"_{size_clean}.png"
            )

    with open("products.json", "w") as file:
        json.dump(products, file, indent=2)

    print("✅ Variant images updated correctly!")

except Exception as e:
    print("❌ Error:", e)