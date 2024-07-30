declare namespace Chai {
  interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
      html(snapshot: string): Assertion;
  }
}
