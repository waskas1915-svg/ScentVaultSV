import json

products = [
    # Dior
        # Farenheit
            # Farenheit EDT
                {
                "id": 1113,
                "name": "Fahrenheit",
                "size": "3ML",
                "price": 5.5,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 1115,
                "name": "Fahrenheit",
                "size": "5ML",
                "price": 9.25,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 11110,
                "name": "Fahrenheit",
                "size": "10ML",
                "price": 18.5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
        # Savague
        # Miss dior
        # Jadore
        # poison
    #Givenchy
        #Gentelman
            # Gentelman Reserve Privée
                    {
                "id": 2113,
                "name": "Gentleman Reserve Privée",
                "size": "3ML",
                "price": 5.25,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 2115,
                "name": "Gentleman Reserve Privée",
                "size": "5ML",
                "price": 8.75,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 21110,
                "name": "Gentleman Reserve Privée",
                "size": "10ML",
                "price": 17.5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },

            # Gentelman Society
                        {
                "id": 2123,
                "name": "Gentleman Society Ambrée",
                "size": "3ML",
                "price": 5,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 2125,
                "name": "Gentleman Society Ambrée",
                "size": "5ML",
                "price": 8.25,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 21210,
                "name": "Gentleman Society Ambrée",
                "size": "10ML",
                "price": 16.5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
    # French Avenue
        # Spectre
            # Spectre Ghost
                                    {
                "id": 3113,
                "name": "Spectre Ghost",
                "size": "3ML",
                "price": 3,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 3115,
                "name": "Spectre Ghost",
                "size": "5ML",
                "price": 4,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 31110,
                "name": "Spectre Ghost",
                "size": "10ML",
                "price": 8,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
        # Aether 
            # Aether Extrait
                                    {
                "id": 3123,
                "name": "Aether Extrait",
                "size": "3ML",
                "price": 3,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 3125,
                "name": "Aether Extrait",
                "size": "5ML",
                "price": 4,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 31210,
                "name": "Aether Extrait",
                "size": "10ML",
                "price": 8,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },  
    # Armaf
        # Club de Nuit 
            # Blue Iconic
                                    {
                "id": 4123,
                "name": "Club De Nuit Blue Iconic",
                "size": "3ML",
                "price": 3,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 4125,
                "name": "Club De Nuit Blue Iconic",
                "size": "5ML",
                "price": 4,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 41210,
                "name": "Club De Nuit Blue Iconic",
                "size": "10ML",
                "price": 6.5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
            # Intense Man Limited Edition
                                    {
                "id": 4213,
                "name": "Club De Nuit Intense Limited Edition Parfum",
                "size": "3ML",
                "price": 3,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 4215,
                "name": "Club De Nuit Intense Limited Edition Parfum",
                "size": "5ML",
                "price": 5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 42110,
                "name": "Club De Nuit Intense Limited Edition Parfum",
                "size": "10ML",
                "price": 10,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
    # Lattafa
        # Pride Al Qiam 
            # Silver Cologne
                                                {
                "id": 5113,
                "name": "Al Qiam Silver",
                "size": "3ML",
                "price": 2,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 5115,
                "name": "Al Qiam Silver",
                "size": "5ML",
                "price": 3,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 51110,
                "name": "Al Qiam Silver",
                "size": "10ML",
                "price": 6,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
        # Give me Gourmand
            # Berry on top 
                                                {
                "id": 5213,
                "name": "Berry on top",
                "size": "3ML",
                "price": 3.25,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 5215,
                "name": "Berry on top",
                "size": "5ML",
                "price": 5.5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 52110,
                "name": "Berry on top",
                "size": "10ML",
                "price": 10.75,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },       

    # Maison alhambra  
        # Kismet
            # Magic
                                                            {
                "id": 6113,
                "name": "Kismet Magic",
                "size": "3ML",
                "price": 1.5,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 6115,
                "name": "Kismet Magic",
                "size": "5ML",
                "price": 2.5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 61110,
                "name": "Kismet Magic",
                "size": "10ML",
                "price": 5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },   

    # Emporio Armany
        # Stronger with you
            # Absolutely
                                                                        {
                "id": 7113,
                "name": "Stronger with you Absolutely",
                "size": "3ML",
                "price": 5,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 7115,
                "name": "Stronger with you Absolutely",
                "size": "5ML",
                "price": 8.25,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 71110,
                "name": "Stronger with you Absolutely",
                "size": "10ML",
                "price": 16.5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },       
    # Tom Ford  
        # Ombre Lether
            # Perfume
                                                                        {
                "id": 8113,
                "name": "Ombre Lether",
                "size": "3ML",
                "price": 12,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 8115,
                "name": "Ombre Lether",
                "size": "5ML",
                "price": 20,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 81110,
                "name": "Ombre Lether",
                "size": "10ML",
                "price": 39,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },    
    # Rayhaan  
    # Arabiyat Prestige  
    # Amaran
    # Afnan
    # Paris Corner
        #Gourmand Mystery
            #Coconut lagoon
                                                                        {
                "id": 9113,
                "name": "Coconut lagoon",
                "size": "3ML",
                "price": 2,
                "image": "https://via.placeholder.com/200",
                "description": "3ML - Las Notas de Salida son flor del moscadero, lavanda, cedro, mandarina, manzanilla, bergamota, flor del espino y limón (lima ácida); las Notas de Corazón son hojas de violeta, nuez moscada, cedro, sándalo, clavel, madreselva, jazmín y lirio de los valles (muguete); las Notas de Fondo son cuero, vetiver, almizcle, ámbar, pachulí y haba tonka."
            },
            {
                "id": 9115,
                "name": "Coconut lagoon",
                "size": "5ML",
                "price": 3.5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },
                {
                "id": 91110,
                "name": "Coconut lagoon",
                "size": "10ML",
                "price": 6.5,
                "image": "https://via.placeholder.com/200",
                "description": "Relaxing lavender lotion for soft skin"
            },   

]

with open("products.json", "w") as file:
    json.dump(products, file, indent=2)

print("products.json created!")