import { DynamicModule, Module } from "@nestjs/common";

export interface Config {
  apiKey: string;
}

@Module({
  providers: [
    {
      provide: "PREFIX",
      useValue: "prefix",
    },
  ],
  exports: ["PREFIX"],
})
export class DynamicConfigModule {
  static forRoot(apiKey?: string): DynamicModule | Promise<DynamicModule> {
    const providers = [
      {
        provide: "CONFIG",
        useValue: { apiKey },
      },
    ];
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          module: DynamicConfigModule,
          providers,
          exports: providers.map((provider) =>
            provider instanceof Function ? provider : provider.provide
          ),
        });
      }, 3000);
    });
    return {
      module: DynamicConfigModule,
      providers,
      exports: providers.map((provider) =>
        provider instanceof Function ? provider : provider.provide
      ),
    };
  }
}
