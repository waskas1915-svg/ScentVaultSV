export function loadLegalContent() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page'); 
    const container = document.getElementById('legal-content-root');
    const cssLink = document.getElementById('dynamic-css');

    if (page === 'terminos') {
        cssLink.href = './css/legal.css';
        container.innerHTML = `
            <div class="legal-wrapper">
                <header class="legal-header">
                    <h1>Términos y Condiciones</h1>
                    <span class="last-update">Última actualización: Abril 2026</span>
                </header>

                <section>
                    <h2>1. Introducción</h2>
                    <p>Al acceder y utilizar el sitio web de <strong>ScentVaultSV</strong>, el usuario acepta cumplir con los términos y condiciones aquí descritos. Estos términos regulan la venta de fragancias originales y decants (muestras) a través de nuestra plataforma en El Salvador.</p>
                </section>

                <section>
                    <h2>2. Información del Producto (Decants)</h2>
                    <p>ScentVaultSV se especializa en la venta de perfumes completos y decants. Un <strong>"decant"</strong> es una muestra de perfume extraída directamente del frasco original y transferida a un atomizador de menor tamaño. El cliente reconoce que recibirá el líquido original en una presentación propia de ScentVaultSV.</p>
                </section>

                <section>
                    <h2>3. Precios y Pagos</h2>
                    <p>Todos los precios están expresados en USD. Aceptamos pagos mediante transferencia bancaria, efectivo (según zona) y tarjetas de crédito/débito vía <strong>Wompi</strong>. Nos reservamos el derecho de modificar precios sin previo aviso.</p>
                </section>

                <section>
                    <h2>4. Envíos en El Salvador</h2>
                    <p>Realizamos envíos a todo el país:</p>
                    <ul>
                        <li><strong>San Salvador y alrededores:</strong> 24 a 48 horas hábiles.</li>
                        <li><strong>Departamentos:</strong> 3 a 5 días hábiles.</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Cambios y Devoluciones</h2>
                    <p>Debido a la naturaleza de los productos, <strong>no se aceptan cambios ni devoluciones</strong> una vez entregado el producto. En caso de daño de fábrica o error en el envío, el cliente tiene 24 horas para reportarlo vía WhatsApp.</p>
                </section>

                <section>
                    <h2>6. Propiedad Intelectual</h2>
                    <p>Las marcas y nombres de fragancias son propiedad de sus respectivos dueños. ScentVaultSV los utiliza únicamente con fines descriptivos e identificativos.</p>
                </section>
            </div>
        `;
    } else if (page === 'privacidad') {
        cssLink.href = './css/legal.css';
        container.innerHTML = `
            <div class="legal-wrapper">
                <header class="legal-header">
                    <h1>Política de Privacidad</h1>
                    <p class="last-update">Tu seguridad es nuestra prioridad</p>
                </header>

                <section>
                    <h2>Recolección de Datos</h2>
                    <p>En <strong>ScentVaultSV</strong>, solicitamos únicamente los datos necesarios para procesar su compra: nombre, dirección de entrega y número de WhatsApp.</p>
                </section>

                <h2>Procesamiento de Pagos</h2>
                <p>La información de sus tarjetas de crédito o débito es procesada de forma segura por <strong>Wompi (Banco Agrícola)</strong>. ScentVaultSV no almacena, ni tiene acceso a sus datos financieros.</p>

                <section>
                    <h2>Uso de la Información</h2>
                    <p>Sus datos se utilizan exclusivamente para la logística de entrega y comunicación directa sobre su pedido. No compartimos sus datos con terceros con fines publicitarios.</p>
                </section>

                <section>
                    <h2>Contacto</h2>
                    <p>Para cualquier duda sobre el manejo de sus datos, puede contactarnos directamente a través de nuestros canales oficiales de atención al cliente.</p>
                </section>
            </div>
        `;
    }
}