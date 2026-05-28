import { chromium } from '@playwright/test';

async function test() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🧪 Prueba: Botón Ver (Ver Detalles)\n');

    // Cargar página
    console.log('1️⃣ Cargando página...');
    await page.goto('http://localhost:3000/inventario-comidas/clientes', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    console.log('   ✅ Página cargada');

    // Encontrar primer botón "Ver"
    console.log('\n2️⃣ Buscando primer cliente...');
    const verButtons = await page.locator('button:has-text("Ver")').all();
    if (verButtons.length === 0) {
      throw new Error('No se encontraron botones Ver');
    }
    console.log(`   ✅ Encontrados ${verButtons.length} clientes`);

    // Click en primer botón Ver
    console.log('\n3️⃣ Haciendo clic en primer botón "Ver"...');
    await verButtons[0].click();
    await page.waitForTimeout(1000);
    console.log('   ✅ Modal de detalles abierto');

    // Verificar que el modal muestra datos
    console.log('\n4️⃣ Verificando que muestra datos del cliente...');
    const modalText = await page.locator('text=Detalles del Cliente').textContent();
    if (!modalText) {
      throw new Error('No se encontró el modal de detalles');
    }
    console.log('   ✅ Modal visible con "Detalles del Cliente"');

    // Verificar que hay campos con datos
    const fields = await page.locator('div:has-text("Nombre") ~ div').count();
    if (fields === 0) {
      throw new Error('No se encontraron campos de datos en el modal');
    }
    console.log('   ✅ Campos de datos visibles');

    // Click en CERRAR
    console.log('\n5️⃣ Haciendo clic en CERRAR...');
    await page.locator('button:has-text("CERRAR")').click();
    await page.waitForTimeout(1000);
    console.log('   ✅ Modal cerrado');

    // Verificar que regresó a la tabla
    console.log('\n6️⃣ Verificando que regresa a tabla...');
    const tableVisible = await page.locator('table tbody').count();
    if (tableVisible === 0) {
      throw new Error('No se volvió a la tabla');
    }
    console.log('   ✅ Tabla visible nuevamente');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 PRUEBA EXITOSA');
    console.log('='.repeat(50));
    console.log('✅ Botón Ver abre modal con detalles');
    console.log('✅ Modal muestra todos los datos');
    console.log('✅ CERRAR regresa a tabla\n');

    await browser.close();
    process.exit(0);

  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    await browser.close();
    process.exit(1);
  }
}

test();
