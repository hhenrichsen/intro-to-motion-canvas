import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import {App, start} from './app';

describe('Rendering', () => {
  let app: App;

  beforeAll(async () => {
    app = await start();
  }, 60 * 1000);

  afterAll(async () => {
    await app.stop();
  }, 60 * 1000);

  test(
    'Animation renders correctly',
    {
      timeout: 60 * 60 * 1000,
    },
    async () => {
      app.page
        .on('console', message =>
          console.log(
            `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`,
          ),
        )
        .on('pageerror', ({message}) => console.log(message))
        .on('response', response =>
          console.log(`${response.status()} ${response.url()}`),
        )
        .on('requestfailed', request =>
          console.log(`${request.failure().errorText} ${request.url()}`),
        );
      await app.page.evaluateHandle('document.fonts.ready');
      await new Promise(resolve => setTimeout(resolve, 5_000));
      await app.page.screenshot();
      const rendering = await app.page.waitForSelector(
        "::-p-xpath(//div[contains(text(), 'Video Settings')])",
      );
      if (rendering) {
        const tab = await app.page.evaluateHandle(
          el => el.parentElement,
          rendering,
        );
        await tab.click();
      }
      await new Promise(resolve => setTimeout(resolve, 1_000));

      await app.page.select(
        "::-p-xpath(//div[contains(text(), 'Rendering')]/parent::div//label[contains(text(), 'exporter')]/parent::div//select)",
        'Image sequence',
      );

      const render = await app.page.waitForSelector('#render');
      await render.click();
      // await app.page.screenshot({path: '/app/screenshots/pre-render.png'});
      await app.page.waitForSelector('#render[data-rendering="true"]', {
        timeout: 5 * 1000,
      });
      await new Promise(resolve => setTimeout(resolve, 5_000));
      // await app.page.screenshot({path: '/app/screenshots/render.png'});
      await app.page.waitForSelector('#render:not([data-rendering="true"])', {
        timeout: 15 * 60 * 1000,
      });
      // await app.page.screenshot({path: '/app/screenshots/post-render.png'});

      expect(true).toBe(true);
    },
  );
});
