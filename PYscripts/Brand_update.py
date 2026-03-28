import json

brand_map = {
    "1": "Dior",
    "2": "Givenchy",
    "3": "French Avenue",
    "4": "Armaf",
    "5": "Lattafa",
    "6": "Maison alhambra",
    "7": "Emporio Armany",
    "8": "Tom Ford ",
    "9": "Paris Corner "
}

try:
    with open("products.json", "r") as file:
        products = json.load(file)

    for product in products:
        product_id = str(product["id"])
        first_digit = product_id[0]

        if first_digit in brand_map:
            product["brand"] = brand_map[first_digit]
        else:
            product["brand"] = "Unknown"

    with open("products.json", "w") as file:
        json.dump(products, file, indent=2)

    print("✅ Brands assigned based on ID!")

except Exception as e:
    print("❌ Error:", e)