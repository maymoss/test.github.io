export default async function run(page, ui) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  // 持續骰,直到出現三顆同點數,或骰滿 30 次
  for (let i = 0; i < 30; i++) {
    await page.locator('#rollBtn').click();
    await page.waitForTimeout(1450);
    const hasGreen = await page.locator('#showjieguo p.same').count();
    if (hasGreen > 0) break;
  }
  const lines = await page.locator('#showjieguo p').evaluateAll(ps =>
    ps.map(p => ({ text: p.textContent, color: getComputedStyle(p).color }))
  );
  await page.screenshot({ path: 'dice_final.png' });
  return { count: lines.length, lines, errors };
}
