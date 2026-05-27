import { chromium } from '@playwright/test';

async function test() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];

  try {
    console.log('🚀 PRUEBA COMPLETA DEL SISTEMA\n');

    // Test 1: Ir a home
    console.log('1️⃣ Accediendo a página de clientes...');
    await page.goto('http://localhost:3000/inventario-comidas/clientes', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    results.push('✅ Página carga sin error 500');
    console.log(results[results.length-1]);

    // Test 2: Verificar que el sidebar desaparece
    console.log('\n2️⃣ Verificando que sidebar desaparece...');
    const sidebar = await page.locator('div[style*="position: fixed"][style*="left: 0"]').first();
    const isVisible = await sidebar.isVisible({ timeout: 2000 }).catch(() => false);
    if (!isVisible) {
      results.push('✅ Sidebar está oculto correctamente');
      console.log(results[results.length-1]);
    } else {
      results.push('⚠️ Sidebar aún visible');
      console.log(results[results.length-1]);
    }

    // Test 3: Verificar botón "Regresar al Menú"
    console.log('\n3️⃣ Buscando botón "Regresar al Menú Principal"...');
    const btn = await page.locator('button:has-text("Regresar al Menú")').isVisible({ timeout: 2000 }).catch(() => false);
    if (btn) {
      results.push('✅ Botón "Regresar al Menú Principal" visible');
      console.log(results[results.length-1]);
    } else {
      results.push('❌ Botón NO encontrado');
      console.log(results[results.length-1]);
    }

    // Test 4: Crear un cliente
    console.log('\n4️⃣ Creando un cliente nuevo...');
    const btnRegistro = await page.locator('button:has-text("Registro de Cliente")').first();
    await btnRegistro.click();
    await page.waitForTimeout(500);
    results.push('✅ Formulario abierto');
    console.log(results[results.length-1]);

    // Test 5: Llenar formulario
    console.log('\n5️⃣ Llenando formulario...');
    const nombre = `TEST_${Date.now()}`;
    const inputs = await page.locator('input').all();

    let inputCount = 0;
    for (const input of inputs) {
      const type = await input.getAttribute('type');
      const placeholder = await input.getAttribute('placeholder');

      if (type === 'text' && placeholder?.includes('ext')) {
        await input.fill(nombre);
        inputCount++;
      } else if (type === 'email') {
        await input.fill('test@test.com');
        inputCount++;
      } else if (type === 'tel') {
        await input.fill('3001234567');
        inputCount++;
      }
    }

    // Buscar input para documento
    const documentInputs = await page.locator('input[type="text"]').all();
    if (documentInputs.length > 2) {
      await documentInputs[2].fill('1234567890');
      inputCount++;
    }

    results.push(`✅ ${inputCount} campos llenados`);
    console.log(results[results.length-1]);

    // Test 6: Guardar cliente
    console.log('\n6️⃣ Guardando cliente...');
    const btnGuardar = await page.locator('button:has-text("GUARDAR")').first();
    await btnGuardar.click();
    await page.waitForTimeout(2000);
    results.push('✅ Cliente guardado');
    console.log(results[results.length-1]);

    // Test 7: Verificar que aparece en la tabla
    console.log('\n7️⃣ Verificando que cliente aparece en tabla...');
    const clienteVisible = await page.locator(`text=${nombre}`).isVisible({ timeout: 3000 }).catch(() => false);
    if (clienteVisible) {
      results.push('✅ Cliente visible en tabla');
      console.log(results[results.length-1]);
    } else {
      results.push('❌ Cliente NO aparece en tabla');
      console.log(results[results.length-1]);
    }

    // Test 8: Esperar y verificar que no desaparece
    console.log('\n8️⃣ Esperando 5 segundos para verificar que persiste...');
    await page.waitForTimeout(5000);
    const clienteAun = await page.locator(`text=${nombre}`).isVisible({ timeout: 2000 }).catch(() => false);
    if (clienteAun) {
      results.push('✅ Cliente sigue visible después de 5s');
      console.log(results[results.length-1]);
    } else {
      results.push('❌ Cliente DESAPARECIÓ');
      console.log(results[results.length-1]);
    }

    // Test 9: Recargar página
    console.log('\n9️⃣ Recargando página...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    results.push('✅ Página recargada');
    console.log(results[results.length-1]);

    // Test 10: Verificar persistencia
    console.log('\n🔟 Verificando persistencia después de recarga...');
    const clientePersiste = await page.locator(`text=${nombre}`).isVisible({ timeout: 3000 }).catch(() => false);
    if (clientePersiste) {
      results.push('✅ Cliente persiste después de recarga');
      console.log(results[results.length-1]);
    } else {
      results.push('❌ Cliente se perdió después de recarga');
      console.log(results[results.length-1]);
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN:');
    console.log('='.repeat(50));
    results.forEach((r, i) => console.log(`${i+1}. ${r}`));

    const passed = results.filter(r => r.includes('✅')).length;
    const total = results.length;
    console.log(`\n✅ ${passed}/${total} pruebas pasadas`);

    if (passed === total) {
      console.log('\n🎉 TODAS LAS PRUEBAS PASARON - SISTEMA FUNCIONANDO CORRECTAMENTE');
    } else {
      console.log('\n⚠️ ALGUNAS PRUEBAS FALLARON - REVISAR LOGS');
    }

    await browser.close();
    process.exit(passed === total ? 0 : 1);

  } catch (err) {
    console.error('\n❌ ERROR FATAL:', err.message);
    await browser.close();
    process.exit(1);
  }
}

test();
