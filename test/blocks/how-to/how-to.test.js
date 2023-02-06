import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { delay } from '../../helpers/waitfor.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/how-to/how-to.js');

const expectedTest1Script = '{"@context":"http://schema.org","@type":"HowTo","name":"How to compress a PDF online (with schema)","description":"Follow these easy steps to compress a large PDF file online:","publisher":{"@type":"Organization","name":"Adobe","logo":{"@type":"ImageObject","url":"https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg"}},"step":[{"@type":"HowToStep","url":"http://localhost:2000/?wtr-session-id=3ttlurFnGTxR4QflqCL7t#how-to-compress-a-pdf-online-with-schema","name":"Step 1","itemListElement":[{"@type":"HowToDirection","text":"Select the PDF file you want to make smaller."}]},{"@type":"HowToStep","url":"http://localhost:2000/?wtr-session-id=3ttlurFnGTxR4QflqCL7t#how-to-compress-a-pdf-online-with-schema","name":"Step 2","image":"http://localhost:2000/media_11010316338257212d075d5d8b91d144d6809bd02.jpeg?width=750&format=jpeg&optimize=medium","itemListElement":[{"@type":"HowToDirection","text":"After uploading, Acrobat will automatically reduce the PDF size."}]},{"@type":"HowToStep","url":"http://localhost:2000/?wtr-session-id=3ttlurFnGTxR4QflqCL7t#how-to-compress-a-pdf-online-with-schema","name":"Step 3","itemListElement":[{"@type":"HowToDirection","text":"Download your compressed PDF file or sign in to share it. Yay!"}]}],"@image":{"@type":"ImageObject","url":"http://localhost:2000/assets/img/compress-pdf-how-to-400x240.svg"}}';


describe('How To', () => {
  it('Renders as an ordered list', async () => {
    let script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.to.exist;

    const howTo = document.querySelector('#test1');
    await init(howTo);
    const howToHeading = document.querySelector('#test1 > .how-to-heading');
    expect(howToHeading).to.exist;
    const howToList = document.querySelector('#test1 > ol');
    expect(howToList).to.exist;
    expect(howToList?.children.length).to.equal(3);

    script = document.querySelector('script[type="application/ld+json"]');
    const wtrSessionRe = /wtr-session-id=.*?#/g;
    expect(script.innerText.replace(wtrSessionRe, '')).to.equal(expectedTest1Script.replace(wtrSessionRe, ''));
    script.remove();
  });

  it('Shows JSON-LD that has required fields present and not null', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const howTo = document.getElementById('test2');
    await init(howTo);
    const script = document.querySelector('script[type="application/ld+json"]');
    // convert script innerHTML to JSON
    const json = JSON.parse(script.innerHTML);
    script.remove();

    // exect all keys to exist
    expect(json).to.have.all.keys(
      '@context',
      '@image',
      '@type',
      'name',
      'description',
      'publisher',
      'step',
    );
    expect(json.publisher).to.have.all.keys(
      '@type',
      'name',
      'logo',
    );
    expect(json.publisher.logo).to.have.all.keys(
      '@type',
      'url',
    );
    expect(json.step[0]).to.have.all.keys(
      '@type',
      'url',
      'name',
      'itemListElement',
    );
    expect(json.step[0].itemListElement[0]).to.have.all.keys(
      '@type',
      'text',
    );

    expect(json['@context']).to.equal('http://schema.org');
    expect(json['@type']).to.equal('HowTo');
    expect(json.name).to.not.equal(null);
    expect(json.description).to.not.equal(null);
    expect(json.publisher).to.not.equal(null);
    expect(json.publisher['@type']).to.equal('Organization');
    expect(json.publisher.name).to.not.equal(null);
    expect(json.publisher.logo['@type']).to.equal('ImageObject');
    expect(json.publisher.logo).to.not.equal(null);
    expect(json.publisher.logo.url).to.not.equal(null);
    expect(json.step).to.not.equal(null);
    expect(json.step[0]['@type']).to.equal('HowToStep');
    expect(json.step[0].url).to.not.equal(null);
    expect(json.step[0].name).to.not.equal(null);
    expect(json.step[0].itemListElement).to.not.equal(null);
    expect(json.step[0].itemListElement[0]['@type']).to.equal('HowToDirection');
    expect(json.step[0].itemListElement[0].text).to.not.equal(null);
  });

  it('Does not add seo data if the seo attribute is not set', async () => {
    // await delay(50);
    // expect(document.querySelectorAll('script[type="application/ld+json"]').length).to.equal(0);

    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const howTo = document.getElementById('test3');
    await init(howTo);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).to.be.null;
  });
});

