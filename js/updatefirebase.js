// Update products
//Copy this script to app.js
import { db } from "./firebase.js";
import { updates } from "./updatefirebase.js";
import { collection, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function migrateProductData() {
  console.log("Iniciando búsqueda y actualización...");

  for (const item of updates) {
    // 1. Buscamos el documento donde el campo 'id' coincida con el de tu lista
    // IMPORTANTE: item.id debe ser número para que coincida con tu base de datos
    const q = query(collection(db, "products"), where("id", "==", parseInt(item.id)));
    
    try {
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.warn(`⚠️ No se encontró producto con campo id: ${item.id}`);
        continue;
      }

      // 2. Si lo encuentra, actualizamos ese documento específico
      querySnapshot.forEach(async (documento) => {
        await updateDoc(documento.ref, {
          marketing: item.marketing,
          faqs: item.faqs
        });
        console.log(`✅ ¡Actualizado con éxito!: ${item.id} - ${documento.id}`);
      });

    } catch (error) {
      console.error(`❌ Error con el ID ${item.id}:`, error);
    }
  }
  console.log("Proceso terminado.");
}

 // migrateProductData();
 //until here

export const updates = [
{
  id: "212", 
  marketing: {
    tagline: "Una evolución audaz de la masculinidad moderna, envuelta en un resplandor ámbar adictivo.",
    family: "Amaderada Ámbar Floral",
    scent_type: "Cálida, Especiada y Magnética",
    notes: {
      opening: "Salvia sclarea y un toque metálico de cardamomo frío.",
      heart: "Un dúo exclusivo de Narciso salvaje y cuatro variedades de Vetiver.",
      foundation: "Vainilla de Madagascar, Cedro y un fondo profundo de Ámbar."
    }
  },
  faqs: [
    { 
      q: "¿En qué se diferencia del Gentleman Society original?", 
      a: "Mientras que el original es más fresco y herbal, la versión Ambrée es mucho más cálida y cremosa gracias a la vainilla y el ámbar, ideal para quienes buscan una estela más intensa." 
    },
    { 
      q: "¿Es una fragancia duradera?", 
      a: "Sí, al ser un Eau de Parfum Ambrée, tiene una fijación excelente de entre 7 a 9 horas, proyectando una elegancia notable durante las primeras horas." 
    },
    { 
      q: "¿Para qué ocasiones se recomienda?", 
      a: "Es perfecta para eventos nocturnos, citas o climas frescos. Su carácter sofisticado la hace ideal para cuando quieres dejar una impresión de madurez y éxito." 
    },
    { 
      q: "¿Dónde debo aplicarla para mayor duración?", 
      a: "Recomendamos aplicarla en puntos de pulso: muñecas, detrás de las orejas y en la base del cuello para que el calor corporal difunda las notas de ámbar gradualmente." 
    }
  ]
},

{
  id: "211", 
  marketing: {
    tagline: "La elegancia absoluta inspirada en el refinamiento del whisky añejo.",
    family: "Amaderada Floral Especiada",
    scent_type: "Cálida, Alcohólica y Elegante",
    notes: {
      opening: "Esencia de Bergamota de Italia y absoluto de Whisky Escocés.",
      heart: "Iris de Florencia (el toque empolvado distintivo) y Castaña.",
      foundation: "Esencia de Cedro, Pachulí de Indonesia y Ámbar."
    }
  },
  faqs: [
    { 
      q: "¿A qué huele Gentleman Réserve Privée?", 
      a: "Es una fragancia única que combina la nota alcohólica del whisky con la elegancia del Iris. Tiene un aroma cremoso, amaderado y ligeramente dulce que recuerda a una biblioteca de lujo o un club privado." 
    },
    { 
      q: "¿Es similar al Dior Homme Intense?", 
      a: "Comparten la nota de Iris empolvado, pero Réserve Privée se diferencia por su nota de whisky y castaña, dándole un carácter más maduro y 'oscuro' que el de Dior." 
    },
    { 
      q: "¿Cuánto dura en la piel?", 
      a: "Tiene una duración sólida de entre 6 a 8 horas. Su proyección es moderada y elegante, diseñada para ser percibida en distancias cortas, lo que la hace muy íntima y seductora." 
    },
    { 
      q: "¿Es adecuado para uso diario?", 
      a: "Es una fragancia formal. Aunque puedes usarla de día en climas frescos, brilla mucho más en eventos nocturnos, cenas especiales o en el entorno profesional si buscas proyectar autoridad." 
    }
  ]
},

{
  id: "312", 
  marketing: {
    tagline: "Una explosión de frescura etérea y vitalidad en máxima concentración.",
    family: "Cítrica Aromática Amaderada",
    scent_type: "Vibrante, Verde y Ultra-Duradera",
    notes: {
      opening: "Manzana Verde crujiente, Bergamota de Calabria y Mandarina.",
      heart: "Petitgrain, Madera de Cedro y un delicado acorde de Violeta.",
      foundation: "Musgo de Roble, Almizcle Blanco y Amberwood."
    }
  },
  faqs: [
    { 
      q: "¿Qué hace especial a Aether Extrait?", 
      a: "A diferencia de otros perfumes cítricos, este es un 'Extrait de Parfum', lo que significa que tiene una mayor concentración de aceites esenciales. Esto le permite mantener su frescura vibrante por mucho más tiempo que un perfume promedio." 
    },
    { 
      q: "¿A qué perfume se parece?", 
      a: "Es ampliamente reconocido por capturar la esencia de Greenley de Parfums de Marly, destacando por su nota de manzana verde realista y su fondo amaderado limpio." 
    },
    { 
      q: "¿Cómo es su rendimiento en el clima de El Salvador?", 
      a: "Es excelente para nuestro clima cálido. Sus notas cítricas y de manzana se mantienen frescas bajo el sol, mientras que su base de Extrait asegura que no se evapore rápidamente, durando entre 7 a 10 horas." 
    },
    { 
      q: "¿Es una fragancia unisex?", 
      a: "Sí, aunque tiene una base amaderada que tiende a lo masculino, su frescura frutal de manzana la hace una opción espectacular y energética para cualquier persona que ame los aromas limpios y naturales." 
    }
  ]
},

{
  id: "411", 
  marketing: {
    tagline: "La obra maestra de Armaf: potencia, refinamiento y el legado del Rey.",
    family: "Amaderada Especiada",
    scent_type: "Ahumada, Frutal y Potente",
    notes: {
      opening: "Piña ahumada, Limón, Bergamota y Manzana.",
      heart: "Abedul (el toque ahumado), Jazmín y Rosa.",
      foundation: "Almizcle, Ámbar gris, Pachulí y Vainilla."
    }
  },
  faqs: [
    { 
      q: "¿En qué se diferencia la Limited Edition del EDT normal?", 
      a: "La Limited Edition es un Parfum real. Elimina la apertura fuerte de limón del EDT, reemplazándola por una salida mucho más natural, suave y una piña más presente. Además, viene en una caja de lujo de coleccionista." 
    },
    { 
      q: "¿Realmente se parece a Creed Aventus?", 
      a: "Es considerada la mejor alternativa en el mercado mundial. Esta versión Limited Edition captura no solo el aroma, sino la complejidad y la estela de los lotes más buscados de Aventus." 
    },
    { 
      q: "¿Qué tal es la duración y proyección?", 
      a: "Es una 'bestia'. En la piel puede durar fácilmente más de 10 horas, y su proyección es pesada durante las primeras 3 horas. Es una fragancia que garantiza cumplidos en cualquier lugar." 
    },
    { 
      q: "¿Para qué clima se recomienda en El Salvador?", 
      a: "Es extremadamente versátil. Funciona perfecto para el calor del día si se aplica con moderación, pero su verdadera potencia sale a relucir en eventos nocturnos o en ambientes de oficina con aire acondicionado." 
    }
  ]
},

{
  id: "811", 
  marketing: {
    tagline: "La libertad del desierto capturada en un cuero floral de lujo absoluto.",
    family: "Cuero Floral (Leather)",
    scent_type: "Cálido, Terroso y Sofisticado",
    notes: {
      opening: "Hoja de Violeta y Cedro (un inicio fresco y amaderado).",
      heart: "Jazmín Sambac y Raíz de Lirio (Iris).",
      foundation: "Cuero negro intenso, Tabaco y notas amaderadas."
    }
  },
  faqs: [
    { 
      q: "¿Cuál es la diferencia entre el Parfum y el Eau de Parfum?", 
      a: "El Parfum es más rico y matizado. Mientras el EDP es un cuero puro y crudo, el Parfum añade notas de hojas de violeta y cedro, lo que lo hace más versátil, lujoso y un poco menos agresivo." 
    },
    { 
      q: "¿Es una fragancia masculina o femenina?", 
      a: "Es oficialmente unisex. Aunque el cuero es una nota tradicionalmente masculina, la suavidad floral del jazmín y la violeta en esta versión Parfum atrae a cualquier persona que busque proyectar poder y distinción." 
    },
    { 
      q: "¿En qué momentos del día se recomienda?", 
      a: "Es la fragancia definitiva para la noche. Sin embargo, su elegancia la hace perfecta para reuniones de negocios importantes o eventos donde quieras destacar por tu sofisticación." 
    },
    { 
      q: "¿Qué tal es su rendimiento?", 
      a: "Excepcional. Al ser concentración Parfum, tiene una longevidad superior a las 10 horas en piel, con una estela que se siente costosa y refinada sin llegar a ser abrumadora." 
    }
  ]
},

{
  id: "412", 
  marketing: {
    tagline: "El equilibrio perfecto entre frescura marina y elegancia amaderada.",
    family: "Aromática Amaderada",
    scent_type: "Fresco, Cítrico y Sofisticado",
    notes: {
      opening: "Toronja (Pomelo), Limón, Menta, Pimienta Rosa y Cilantro.",
      heart: "Jengibre, Melón, Jazmín y Nuez Moscada.",
      foundation: "Sándalo, Ámbar, Incienso, Cedro y Pachulí."
    }
  },
  faqs: [
    { 
      q: "¿A qué perfume se parece Blue Iconic?", 
      a: "Es la interpretación de Armaf del famoso Bleu de Chanel (específicamente una mezcla entre el EDP y el Parfum). Logra capturar esa vibra de 'hombre limpio y exitoso' con una duración mucho mayor que el original." 
    },
    { 
      q: "¿Es una fragancia para el calor?", 
      a: "Es ideal para el clima de El Salvador. Sus notas de menta y cítricos la hacen muy refrescante para el día, mientras que el fondo de incienso y sándalo le da el cuerpo necesario para destacar en la noche." 
    },
    { 
      q: "¿Qué tal es la duración?", 
      a: "Blue Iconic es conocido por ser uno de los mejores 'azules' en rendimiento. Puedes esperar entre 8 a 10 horas de fijación, superando por mucho a otras fragancias cítricas convencionales." 
    },
    { 
      q: "¿Para qué edad se recomienda?", 
      a: "Es una fragancia sumamente versátil y atemporal. Funciona perfecto desde jóvenes hasta adultos; es el aroma ideal para quien busca un solo perfume que sirva para cualquier ocasión (oficina, gimnasio, citas)." 
    }
  ]
},

{
  id: "311", 
  marketing: {
    tagline: "Un viaje sensorial entre la frescura especiada y la vainilla más seductora.",
    family: "Ámbar Floral",
    scent_type: "Cremoso, Especiado y Opulento",
    notes: {
      opening: "Jengibre, Bergamota, Pimienta Rosa y notas verdes.",
      heart: "Cardamomo, Grosellas negras y Rosa turca.",
      foundation: "Vainilla, Benzoin, Sándalo, Pachulí y Almizcle."
    }
  },
  faqs: [
    { 
      q: "¿A qué fragancia recuerda Spectre Ghost?", 
      a: "Es la interpretación más fiel y lujosa de Ani de Nishane. Logra capturar esa apertura cítrica y picante que evoluciona hacia una vainilla amaderada sumamente sofisticada." 
    },
    { 
      q: "¿Es un perfume muy dulce?", 
      a: "No es el típico dulce empalagoso. La presencia del jengibre y las notas verdes en la salida equilibran la vainilla, creando un aroma cremoso pero con mucha personalidad y frescura." 
    },
    { 
      q: "¿Cómo es su desempeño?", 
      a: "Como es característico de French Avenue, su rendimiento es sobresaliente. Tiene una fijación de más de 9 horas en piel y una proyección que se hace notar sin ser invasiva." 
    },
    { 
      q: "¿En qué ocasiones destaca más?", 
      a: "Es una fragancia que proyecta aura de 'persona adinerada'. Brilla intensamente en citas, cenas elegantes o eventos en climas frescos donde quieras dejar una estela inolvidable." 
    }
  ]
},

{
  id: "711", 
  marketing: {
    tagline: "El poder absoluto del amor capturado en una esencia licorosa y masculina.",
    family: "Ámbar Fougère",
    scent_type: "Cálido, Licoroso y Adictivo",
    notes: {
      opening: "Ron (acorde de licor), Bergamota y un toque de resina de Elemi.",
      heart: "Lavanda Diva de Francia y Davana (que aporta una faceta frutal y dulce).",
      foundation: "Castaña glaseada, Vainilla de Madagascar, Cedro y Pachulí."
    }
  },
  faqs: [
    { 
      q: "¿Qué diferencia al Absolutely de las otras versiones de Stronger With You?", 
      a: "El Absolutely es la versión más concentrada y madura. Se diferencia por su nota de ron licoroso y un carácter menos dulce y más ahumado que el original o el Intensely." 
    },
    { 
      q: "¿Es una fragancia para el día a día?", 
      a: "Debido a su intensidad y calidez, es una fragancia diseñada para la noche o climas fríos. En El Salvador, es la elección perfecta para una cita romántica, una boda o un evento formal nocturno." 
    },
    { 
      q: "¿Cuánto dura en la piel?", 
      a: "Es una de las fragancias con mejor rendimiento de Armani. Su fijación supera fácilmente las 10-12 horas, y su estela es pesada pero muy atractiva, ideal para destacar en ambientes abiertos." 
    },
    { 
      q: "¿A qué tipo de hombre le queda mejor?", 
      a: "Es perfecta para el hombre que busca proyectar seguridad, calidez y un toque de misterio. Es un aroma que invita a la cercanía gracias a su combinación de vainilla y castaña." 
    }
  ]
},

{
  id: "611", 
  marketing: {
    tagline: "Un elixir licoroso de canela y vainilla que redefine la seducción gourmet.",
    family: "Ámbar Vainilla (Gourmand)",
    scent_type: "Cálido, Dulce y Especiado",
    notes: {
      opening: "Coñac, Canela y un toque de Haba Tonka.",
      heart: "Madera de Roble, Praliné y maderas preciosas.",
      foundation: "Vainilla, Sándalo y un fondo de Amberwood."
    }
  },
  faqs: [
    { 
      q: "¿A qué huele Kismet Magic?", 
      a: "Huele exactamente a un pay de manzana recién horneado con canela y un toque de coñac fino. Es una fragancia 'Gourmand' (comestible) que proyecta lujo y calidez desde la primera atomización." 
    },
    { 
      q: "¿Es similar a Angel's Share de Kilian?", 
      a: "Es considerado uno de los mejores dups del mundo. Captura la misma esencia licorosa y amaderada por una fracción del precio del original, manteniendo una calidad de ingredientes sorprendente." 
    },
    { 
      q: "¿Qué tal es su fijación?", 
      a: "Tiene una duración muy buena, entre 7 a 9 horas en piel. En ropa, el aroma a canela y vainilla puede durar días. Es un perfume que se hace notar sin llegar a ser hostigante." 
    },
    { 
      q: "¿Cuándo es mejor usarlo en El Salvador?", 
      a: "Debido a su dulzura y notas de coñac, brilla en las noches frescas, eventos formales o en ambientes con aire acondicionado. Es el perfume definitivo para captar atención y recibir cumplidos." 
    }
  ]
},

{
  id: "511", 
  marketing: {
    tagline: "La definición del lujo cítrico: frescura radiante con un fondo amaderado señorial.",
    family: "Cítrica Aromática Amaderada",
    scent_type: "Limpio, Lujoso y Energizante",
    notes: {
      opening: "Toronja (Pomelo) jugosa y una explosión de notas cítricas frescas.",
      heart: "Jengibre picante y notas amaderadas de sándalo.",
      foundation: "Ambroxan y Vetiver (que aportan una base limpia y duradera)."
    }
  },
  faqs: [
    { 
      q: "¿A qué huele Al Qiam Silver?", 
      a: "Huele a una toronja natural y chispeante mezclada con un ambroxan muy limpio y elegante. Es un aroma que proyecta pulcritud, modernidad y éxito." 
    },
    { 
      q: "¿Es cierto que se parece a Tygar de Bvlgari?", 
      a: "Sí, es considerado uno de los mejores clones de Tygar. Logra esa misma sensación de frescura costosa y masculina que caracteriza a la fragancia de Bvlgari, pero con la excelente relación calidad-precio de Lattafa Pride." 
    },
    { 
      q: "¿Cómo se comporta en el calor de El Salvador?", 
      a: "Es probablemente uno de los mejores perfumes para nuestro clima. Su frescura cítrica no se vuelve pesada con el sudor; al contrario, se reactiva y proyecta un aura de limpieza durante todo el día." 
    },
    { 
      q: "¿Qué duración tiene?", 
      a: "A pesar de ser un perfume cítrico, su duración es sorprendente gracias a la base de ambroxan, alcanzando fácilmente las 8 horas en piel. Es ideal para jornadas largas de trabajo o eventos al aire libre." 
    }
  ]
},

{
  id: "521", 
  marketing: {
    tagline: "Un postre de frutas rojas y crema que despierta tus sentidos más dulces.",
    family: "Floral Frutal Gourmand",
    scent_type: "Dulce, Cremoso y Juvenil",
    notes: {
      opening: "Frutas rojas (fresa y frambuesa) y un toque de Bergamota.",
      heart: "Malvavisco (Marshmallow), Gardenia y acordes florales suaves.",
      foundation: "Vainilla, Almizcle y un fondo cremoso de Sándalo."
    }
  },
  faqs: [
    { 
      q: "¿A qué huele Berry on Top?", 
      a: "Huele a un batido de frutas rojas con malvaviscos y crema batida. Es una fragancia extremadamente dulce y reconfortante, perfecta para las amantes de los aromas 'comestibles' y femeninos." 
    },
    { 
      q: "¿Es un perfume muy empalagoso?", 
      a: "Aunque es dulce, la bergamota en la salida le da un toque cítrico que equilibra el azúcar inicial. Se asienta en la piel como una nube cremosa de vainilla y frutas muy agradable." 
    },
    { 
      q: "¿Qué tal es la fijación?", 
      a: "Como es común en Lattafa Pride, la duración es excelente. En la piel suele durar entre 7 a 8 horas, manteniendo esa estela de vainilla y fresa durante casi toda la jornada." 
    },
    { 
      q: "¿Para qué edad se recomienda?", 
      a: "Es una fragancia muy versátil. Por su dulzura suele encantar a un público joven, pero su fondo cremoso de sándalo le da una sofisticación que cualquier mujer que ame los aromas frutales puede disfrutar." 
    }
  ]
},

{
  id: "111", 
  marketing: {
    tagline: "Un clásico revolucionario que redefine la masculinidad con fuego y elegancia.",
    family: "Aromática Fougère",
    scent_type: "Ahumada, Cuero y Floral",
    notes: {
      opening: "Flor de nuez moscada, Lavanda, Cedro y Mandarina.",
      heart: "Hojas de Violeta, Madreselva, Sándalo y Jazmín.",
      foundation: "Cuero intenso, Vetiver, Almizcle y Ámbar."
    }
  },
  faqs: [
    { 
      q: "¿Por qué se dice que huele a gasolina?", 
      a: "Es una de las características más famosas de Fahrenheit. La combinación de la hoja de violeta con el cuero crea un acorde 'metálico y aceitoso' que recuerda al aroma de la gasolina fina, lo cual le da un carácter rudo y sumamente atractivo." 
    },
    { 
      q: "¿Sigue siendo moderno este perfume?", 
      a: "Totalmente. Lanzado originalmente en 1988, Fahrenheit ha roto las barreras del tiempo. Sigue siendo una fragancia firma para hombres que no quieren oler como el resto y buscan proyectar una personalidad fuerte." 
    },
    { 
      q: "¿Qué tal es su duración?", 
      a: "A pesar de ser un Eau de Toilette, su rendimiento es legendario. Tiene una fijación de entre 8 a 10 horas y una proyección que se hace notar sin pedir permiso." 
    },
    { 
      q: "¿Es una fragancia para compras a ciegas?", 
      a: "Fahrenheit es una fragancia con mucha personalidad (la amas o la odias). La recomendamos para hombres que disfrutan de aromas complejos, maduros y con carácter. No es el típico perfume dulce moderno, es una declaración de estilo." 
    }
  ]
},

{
  id: "911", 
  marketing: {
    tagline: "Un oasis tropical de coco cremoso y brisa marina en tu piel.",
    family: "Cítrica Ámbar (Gourmand Tropical)",
    scent_type: "Fresco, Cremoso y Exótico",
    notes: {
      opening: "Coco fresco, Lima ácida y Bergamota blanca.",
      heart: "Jazmín de la India, Jengibre picante y notas de Ylang-Ylang.",
      foundation: "Caña de azúcar, Ron blanco y Almizcle cálido."
    }
  },
  faqs: [
    { 
      q: "¿A qué huele Coconut Lagoon?", 
      a: "Huele a un cóctel tropical de lujo. Imagina una mezcla de coco cremoso con un toque de lima fresca y un fondo dulce de caña de azúcar. Es un aroma extremadamente limpio, fresco y adictivo." 
    },
    { 
      q: "¿Se parece a Virgin Island Water de Creed?", 
      a: "Sí, es ampliamente reconocido como una de las mejores alternativas a Virgin Island Water. Captura esa vibra caribeña de coco y cítricos de alta gama por una fracción de su precio." 
    },
    { 
      q: "¿Es adecuado para el uso diario en El Salvador?", 
      a: "Es el perfume definitivo para nuestro clima. Su frescura lo hace perfecto para el calor del día, salidas a la playa o eventos casuales bajo el sol, manteniéndote con una sensación de frescura tropical durante horas." 
    },
    { 
      q: "¿Es una fragancia para hombres o mujeres?", 
      a: "Es totalmente unisex. La combinación de coco y lima es universalmente atractiva y funciona de maravilla en cualquier persona que busque un aroma relajado, veraniego y sofisticado." 
    }
  ]
}
];