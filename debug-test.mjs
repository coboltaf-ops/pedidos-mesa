import { chromium } from '@playwright/test';

async function test() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🚀 PRUEBA DE DEBUG\n');

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
    await page.waitForTimeout(500);

    // Llenar formulario con mucho más detalle
    console.log('\n3️⃣ Llenando formulario...');
    const nombre = `TEST_${Date.now()}`;

    const inputs = await page.locator('input').all();
    console.log(`   Total de inputs encontrados: ${inputs.length}`);

    let filled = 0;
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = await input.getAttribute('type');
      const placeholder = await input.getAttribute('placeholder');
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');

      console.log(`   Input ${i}: type=${type}, placeholder=${placeholder}, id=${id}, name=${name}`);

      if (type === 'text' && placeholder?.includes('Nombre')) {
        console.log(`      → Llenando Nombre: ${nombre}`);
        await input.fill(nombre);
        filled++;
      } else if (type === 'email') {
        console.log(`      → Llenando Email: test@test.com`);
        await input.fill('test@test.com');
        filled++;
      } else if (type === 'tel') {
        console.log(`      → Llenando Teléfono: 3001234567`);
        await input.fill('3001234567');
        filled++;
      } else if (type === 'text' && (placeholder?.includes('Documento') || placeholder?.includes('documento'))) {
        console.log(`      → Llenando Documento: 1234567890`);
        await input.fill('1234567890');
        filled++;
      }
    }

    console.log(`   ✅ ${filled} campos llenados`);

    // Guardar
    console.log('\n4️⃣ Guardando cliente...');
    const btnGuardar = await page.locator('button:has-text("GUARDAR")').first();

    // Esperar a que se muestre el alert
    const alertPromise = page.waitForEvent('dialog');
    await btnGuardar.click();
    const dialog = await alertPromise;
    console.log(`   Alert: ${dialog.message()}`);
    await dialog.accept();

    await page.waitForTimeout(1000);

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
        console.log(`   ❌ Cliente NO encontrado por nombre. Contenido de tabla:`);
        rowsText.forEach((row, i) => {
          console.log(`      Fila ${i + 1}: ${row.substring(0, 100)}...`);
        });
      }
    } else {
      console.log(`   ❌ NO se agregaron clientes a la tabla`);
    }

    // Esperar 5 segundos y verificar que no desaparece
    console.log('\n6️⃣ Esperando 5 segundos...');
    await page.waitForTimeout(5000);

    const tableRowsFinal = await page.locator('table tbody tr').count();
    console.log(`   Clientes después de 5s: ${tableRowsFinal}`);

    if (tableRowsFinal === tableRows) {
      console.log(`   ✅ Cliente persiste después de 5 segundos`);
    } else {
      console.log(`   ❌ Número de clientes cambió de ${tableRows} a ${tableRowsFinal}`);
    }

    await browser.close();
    process.exit(0);

  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    await browser.close();
    process.exit(1);
  }
}

test();
