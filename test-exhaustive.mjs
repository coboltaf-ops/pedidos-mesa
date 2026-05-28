import { chromium } from '@playwright/test';

async function test() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🧪 PRUEBA EXHAUSTIVA Y EXHAUSTIVA\n');

    // TEST 1: Carga inicial
    console.log('TEST 1️⃣: Carga inicial de página');
    await page.goto('http://localhost:3000/inventario-comidas/clientes', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const initialCount = await page.locator('table tbody tr').count();
    console.log(`   ✅ Página cargó. Clientes iniciales: ${initialCount}`);
    if (initialCount !== 2) {
      throw new Error(`❌ Se esperaban 2 clientes iniciales, se encontraron ${initialCount}`);
    }

    // TEST 2: Crear primer cliente
    console.log('\nTEST 2️⃣: Crear PRIMER cliente');
    await page.locator('button:has-text("Registro de Cliente")').click();
    await page.waitForTimeout(1000);
    const inputs = await page.locator('input[type="text"]').all();
    if (inputs.length > 1) {
      await inputs[0].fill('CLIENTE_PRUEBA_1');
      await inputs[1].fill('123456');
    }
    await page.fill('input[type="email"]', 'prueba1@test.com');
    await page.fill('input[type="tel"]', '3001234567');
    const dialogPromise1 = page.waitForEvent('dialog');
    await page.locator('button:has-text("GUARDAR")').click();
    const dialog1 = await dialogPromise1;
    console.log(`   Respuesta: ${dialog1.message()}`);
    await dialog1.accept();
    await page.waitForTimeout(2000);
    const count1 = await page.locator('table tbody tr').count();
    console.log(`   Clientes después: ${initialCount} → ${count1}`);
    if (count1 !== initialCount + 1) {
      throw new Error(`❌ Cliente 1 no se agregó correctamente`);
    }

    // TEST 3: Esperar polling - cliente debe PERSISTIR
    console.log('\nTEST 3️⃣: Esperar polling (5-7s) - cliente debe persistir');
    await page.waitForTimeout(7000);
    const countAfterPolling = await page.locator('table tbody tr').count();
    console.log(`   Después polling: ${countAfterPolling}`);
    if (countAfterPolling !== count1) {
      throw new Error(`❌ Cliente desapareció después del polling (${count1} → ${countAfterPolling})`);
    }
    console.log(`   ✅ Cliente persiste sin desaparecer`);

    // TEST 4: Crear SEGUNDO cliente
    console.log('\nTEST 4️⃣: Crear SEGUNDO cliente (mientras polling está corriendo)');
    await page.locator('button:has-text("Registro de Cliente")').click();
    await page.waitForTimeout(1000);
    const inputs2 = await page.locator('input[type="text"]').all();
    if (inputs2.length > 1) {
      await inputs2[0].fill('CLIENTE_PRUEBA_2');
      await inputs2[1].fill('789012');
    }
    await page.fill('input[type="email"]', 'prueba2@test.com');
    await page.fill('input[type="tel"]', '3009876543');
    const dialogPromise2 = page.waitForEvent('dialog');
    await page.locator('button:has-text("GUARDAR")').click();
    const dialog2 = await dialogPromise2;
    console.log(`   Respuesta: ${dialog2.message()}`);
    await dialog2.accept();
    await page.waitForTimeout(2000);
    const count2 = await page.locator('table tbody tr').count();
    console.log(`   Clientes después: ${countAfterPolling} → ${count2}`);
    if (count2 !== countAfterPolling + 1) {
      throw new Error(`❌ Cliente 2 no se agregó`);
    }

    // TEST 5: Esperar polling nuevamente
    console.log('\nTEST 5️⃣: Esperar polling (5-7s) nuevamente');
    await page.waitForTimeout(7000);
    const count2AfterPolling = await page.locator('table tbody tr').count();
    console.log(`   Después polling: ${count2AfterPolling}`);
    if (count2AfterPolling !== count2) {
      throw new Error(`❌ Un cliente desapareció en segundo polling (${count2} → ${count2AfterPolling})`);
    }
    console.log(`   ✅ Ambos clientes persisten`);

    // TEST 6: Recargar página
    console.log('\nTEST 6️⃣: Recargar página');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const reloadCount = await page.locator('table tbody tr').count();
    console.log(`   Clientes después reload: ${reloadCount}`);
    if (reloadCount !== count2) {
      throw new Error(`❌ Clientes se perdieron en reload (${count2} → ${reloadCount})`);
    }
    console.log(`   ✅ Todos los clientes persisten después reload`);

    // TEST 7: Verificar que aparecen los nombres correctos
    console.log('\nTEST 7️⃣: Verificar contenido de clientes creados');
    const cells = await page.locator('table tbody tr td').allTextContents();
    const hasCliente1 = cells.some(c => c.includes('CLIENTE_PRUEBA_1'));
    const hasCliente2 = cells.some(c => c.includes('CLIENTE_PRUEBA_2'));
    if (!hasCliente1 || !hasCliente2) {
      throw new Error(`❌ No se encontraron los clientes creados en la tabla`);
    }
    console.log(`   ✅ Ambos clientes aparecen en la tabla`);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 TODAS LAS PRUEBAS PASARON');
    console.log('='.repeat(50));
    console.log('\n✅ Creación de clientes múltiples');
    console.log('✅ Persistencia durante polling');
    console.log('✅ Persistencia después de reload');
    console.log('✅ Sin desapariciones inesperadas');
    console.log('✅ Datos consistentes\n');

    await browser.close();
    process.exit(0);

  } catch (err) {
    console.error('\n❌ ERROR EN PRUEBA:', err.message);
    await browser.close();
    process.exit(1);
  }
}

test();
