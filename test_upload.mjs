import { chromium } from 'playwright';
import { expect } from '@playwright/test';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log("Navigating to app...");
        await page.goto('http://localhost:5173/english-study/');

        console.log("Clicking '사용자 학습'...");
        await page.getByText('사용자 학습').click();

        console.log("Uploading file...");
        // In playwright, we can set the input files directly
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByText('단어 파일 업로드 (.txt)').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles('d:/00_Source/devSCKwon/antigravity-skills/english-study/test_words.txt');

        console.log("Waiting for combobox to update...");
        // Check if the select exists and has the file
        const select = page.locator('select');
        await expect(select).toBeVisible();
        const selectText = await select.textContent();
        console.log("Select box shows:", selectText);

        console.log("Clicking '선택한 단어장으로 학습 시작'...");
        await page.getByRole('button', { name: /선택한 단어장으로 학습 시작/ }).click();

        console.log("Verifying study UI...");
        // The study UI shows x/8 words and the word itself.
        await page.waitForTimeout(1000); // Give it a sec to render
        const bodyText = await page.locator('body').innerText();

        if (bodyText.includes('단어 1 / 8') && bodyText.includes('dog')) {
            console.log("SUCCESS: Upload and study flow worked perfectly! Found '단어 1 / 8' and 'dog'.");
        } else {
            console.log("FAILED: Could not find expected study UI text. Body text:", bodyText);
        }

    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await browser.close();
    }
})();
