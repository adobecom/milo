import test from 'node:test';
import assert from 'node:assert/strict';
import { mock } from 'node:test';
import { renderHtmlTemplate } from '../../lib/render/template.ts';

test('renderHtmlTemplate throws on mismatched closing tags', () => {
  assert.throws(
    () => renderHtmlTemplate('{{#if a}}hello{{/each}}', { a: true }),
    /Mismatched template closing tag: expected if, got each/,
  );
});

test('renderHtmlTemplate throws on unclosed #each when inner tags are present', () => {
  assert.throws(
    () => renderHtmlTemplate('{{#each items}}{{x}}', { items: [{ x: 'a' }] }),
    /Missing closing template tag for each/,
  );
});

test('renderHtmlTemplate throws on unclosed #if even when no inner tags follow', () => {
  assert.throws(
    () => renderHtmlTemplate('{{#if a}}hello', { a: true }),
    /Missing closing template tag for if/,
  );
});

test('renderHtmlTemplate warns on #each with non-array value', () => {
  const warns: string[] = [];
  mock.method(console, 'warn', (msg: string) => warns.push(msg));
  const result = renderHtmlTemplate('before{{#each items}}x{{/each}}after', { items: 'not-an-array' });
  assert.equal(result, 'beforeafter');
  assert.ok(warns.some((msg) => msg.includes('#each items') && msg.includes('expected array')));
  mock.restoreAll();
});

test('renderHtmlTemplate renders empty for #each with undefined or empty array', () => {
  assert.equal(
    renderHtmlTemplate('a{{#each items}}x{{/each}}b', {}),
    'ab',
  );
  assert.equal(
    renderHtmlTemplate('a{{#each items}}x{{/each}}b', { items: [] }),
    'ab',
  );
});

test('renderHtmlTemplate supports {{else}} in if blocks', () => {
  assert.equal(
    renderHtmlTemplate('{{#if show}}yes{{else}}no{{/if}}', { show: true }),
    'yes',
  );
  assert.equal(
    renderHtmlTemplate('{{#if show}}yes{{else}}no{{/if}}', { show: false }),
    'no',
  );
  assert.equal(
    renderHtmlTemplate('{{#if items}}has items{{else}}empty{{/if}}', { items: [] }),
    'empty',
  );
});

test('renderHtmlTemplate supports {{#unless}} with else', () => {
  assert.equal(
    renderHtmlTemplate('{{#unless hidden}}visible{{/unless}}', { hidden: false }),
    'visible',
  );
  assert.equal(
    renderHtmlTemplate('{{#unless hidden}}visible{{/unless}}', { hidden: true }),
    '',
  );
  assert.equal(
    renderHtmlTemplate('{{#unless hidden}}visible{{else}}hidden{{/unless}}', { hidden: true }),
    'hidden',
  );
});

test('renderHtmlTemplate provides @index and @key in #each blocks', () => {
  const result = renderHtmlTemplate(
    '{{#each items}}{{@index}}:{{@key}}:{{name}} {{/each}}',
    { items: [{ name: 'a' }, { name: 'b' }, { name: 'c' }] },
  );
  assert.equal(result, '0:0:a 1:1:b 2:2:c ');
});

test('renderHtmlTemplate supports nested if/each blocks and escapes values', () => {
  const template = [
    '<section>',
    '{{#if sections}}',
    '  {{#each sections}}',
    '  <h2>{{heading}}</h2>',
    '  {{#each links}}',
    '  <a href="{{url}}">{{title}}</a>',
    '  {{/each}}',
    '  {{/each}}',
    '{{/if}}',
    '</section>',
  ].join('\n');

  const html = renderHtmlTemplate(template, {
    sections: [
      {
        heading: 'Products & Services',
        links: [
          {
            title: 'Adobe <Commerce>',
            url: 'https://business.adobe.com/products/commerce?x=1&y=2',
          },
        ],
      },
    ],
  });

  assert.equal(html, [
    '<section>',
    '  <h2>Products &amp; Services</h2>',
    '  <a href="https://business.adobe.com/products/commerce?x=1&amp;y=2">Adobe &lt;Commerce&gt;</a>',
    '</section>',
  ].join('\n'));
});
