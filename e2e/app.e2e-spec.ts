import { ConnectFourAppPage } from './app.po';

describe('connect-four-app App', () => {
  let page: ConnectFourAppPage;

  beforeEach(() => {
    page = new ConnectFourAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
