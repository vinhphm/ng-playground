import { registerLocaleData } from '@angular/common'
import { provideHttpClient } from '@angular/common/http'
import en from '@angular/common/locales/en'
import {
  type ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core'
import { FormsModule } from '@angular/forms'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter } from '@angular/router'
// Import required icons
import {
  ArrowLeftOutline,
  DeleteOutline,
  EditOutline,
  EyeOutline,
  FileTextOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  MessageOutline,
  PlusOutline,
  ReloadOutline,
  SaveOutline,
  UserOutline,
} from '@ant-design/icons-angular/icons'
import { routes } from '@app/app.routes'
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental'
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n'
import { provideNzIcons } from 'ng-zorro-antd/icon'
import { NzModalService } from 'ng-zorro-antd/modal'

registerLocaleData(en)

const icons = [
  UserOutline,
  FileTextOutline,
  MessageOutline,
  EyeOutline,
  EditOutline,
  DeleteOutline,
  PlusOutline,
  ArrowLeftOutline,
  SaveOutline,
  ReloadOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
]

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzI18n(en_US),
    provideNzIcons(icons),
    importProvidersFrom(FormsModule),
    NzModalService,
    provideTanStackQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
    ),
  ],
}
