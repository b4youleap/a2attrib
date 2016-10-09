import { A2attribPage } from './app.po';

describe('a2attrib App', function() {
  let page: A2attribPage;

  beforeEach(() => {
    page = new A2attribPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
