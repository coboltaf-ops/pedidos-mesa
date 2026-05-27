import { chromium } from '@playwright/test';

async function test() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🚀 PRUEBA DE DEBUG V2\n');

    // Acceder a la página
    console.log('1️⃣ Accediendo a página de clientes...');
    await page.goto('http://localhost:3000/inventario-comidas/clientes', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Verificar initial state
    const initialTableRows = await page.locator('table tbody tr').count();
    console.log(`   Clientes iniciales en tabla: ${initialTableRows}`);

    // Abrir formulario
    console.log('\n2️⃣ Abriendo formulario...');
    const btnRegistro = await page.locator('button:has-text("Registro de Cliente")').first();
    await btnRegistro.click();
    await page.waitForTimeout(1000);

    const nombre = `TEST_${Date.now()}`;
    const email = `test${Date.now()}@test.com`;
    const documento = `${Date.now()}`.slice(-10);

    // Llenar usando labels como referencia
    console.log('\n3️⃣ Llenando formulario...');

    // Nombre - está después del label "Nombre *"
    console.log(`   Llenando Nombre: ${nombre}`);
    await page.fill('input[value=""]', nombre);

    // Documento
    console.log(`   Llenando Documento: ${documento}`);
    const inputs = await page.locator('input[type="text"]').all();
    if (inputs.length > 1) {
      await inputs[1].fill(documento);
    }

    // Email
    console.log(`   Llenando Email: ${email}`);
    await page.fill('input[type="email"]', email);

    // Teléfono
    console.log(`   Llenando Teléfono: 3001234567`);
    await page.fill('input[type="tel"]', '3001234567');

    await page.waitForTimeout(500);

    // Guardar
    console.log('\n4️⃣ Guardando cliente...');
    const btnGuardar = await page.locator('button:has-text("GUARDAR")').first();

    // Esperar a que se muestre el alert
    const alertPromise = page.waitForEvent('dialog');
    await btnGuardar.click();
    const dialog = await alertPromise;
    console.log(`   Alert: ${dialog.message()}`);
    await dialog.accept();

    await page.waitForTimeout(2000);

    // Verificar table después de guardar
    console.log('\n5️⃣ Verificando tabla después de guardar...');
    const tableRows = await page.locator('table tbody tr').count();
    console.log(`   Clientes en tabla ahora: ${tableRows}`);

    if (tableRows > initialTableRows) {
      console.log(`   ✅ Se agregó ${tableRows - initialTableRows} cliente(s)`);

      // Buscar el cliente por nombre
      const rowsText = await page.locator('table tbody tr').allTextContents();
      const foundIdx = rowsText.findIndex(row => row.includes(nombre));
      if (foundIdx >= 0) {
        console.log(`   ✅ Cliente encontrado en tabla (fila ${foundIdx + 1})`);
      } else {
        console.log(`   ❌ Cliente NO encontrado por nombre "${nombre}". Contenido de tabla:`);
        rowsText.forEach((row, i) => {
          console.log(`      Fila ${i + 1}: ${row.substring(0, 80)}...`);
        });
      }
    } else {
      console.log(`   ❌ NO se agregaron clientes a la tabla`);
    }

    // Esperar 7 segundos (para que el polling se ejecute 1-2 veces)
    console.log('\n6️⃣ Esperando 7 segundos para polling...');
    await page.waitForTimeout(7000);

    const tableRowsFinal = await page.locator('table tbody tr').count();
    console.log(`   Clientes después de 7s: ${tableRowsFinal}`);

    if (tableRowsFinal === tableRows) {
      console.log(`   ✅ Cliente persiste después del polling`);
    } else {
      console.log(`   ❌ Número de clientes cambió de ${tableRows} a ${tableRowsFinal}`);
      const rowsTextFinal = await page.locator('table tbody tr').allTextContents();
      rowsTextFinal.forEach((row, i) => {
        console.log(`      Fila ${i + 1}: ${row.substring(0, 80)}...`);
      });
    }

    await browser.close();
    process.exit(0);

  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    console.error(err.stack);
    await browser.close();
    process.exit(1);
  }
}

test();
