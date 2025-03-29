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
  static forRoot(): DynamicModule {
    const providers = [
      {
        provide: "CONFIG",
        useValue: { apiKey: "123" },
      },
    ];
    return {
      module: DynamicConfigModule,
      providers,
      exports: providers.map((provider) =>
        provider instanceof Function ? provider : provider.provide
      ),
    };
  }
}
