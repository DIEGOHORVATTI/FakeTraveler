import ar from './locales/ar.json'
import da from './locales/da.json'
import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import hi from './locales/hi.json'
import id from './locales/id.json'
import it from './locales/it.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import nl from './locales/nl.json'
import pl from './locales/pl.json'
import pt from './locales/pt.json'
import ptBR from './locales/pt-BR.json'
import ru from './locales/ru.json'
import sv from './locales/sv.json'
import tr from './locales/tr.json'
import uk from './locales/uk.json'
import vi from './locales/vi.json'
import zh from './locales/zh.json'
import type { TranslationBundle } from './resolve-bundle'

export const bundles: Record<string, TranslationBundle> = {
  ar,
  da,
  de,
  en,
  es,
  fr,
  hi,
  id,
  it,
  ja,
  ko,
  nl,
  pl,
  pt,
  'pt-BR': ptBR,
  ru,
  sv,
  tr,
  uk,
  vi,
  zh,
}
