## 装饰器

ts 的装饰在不同版本的 typescript 上写法会有所不同,因为,ts 的装饰器是一个实验性的特性,一般一个特性要正式实装,需要经过五个阶段,分别是 设想(stage0),提案(stage1),草案(stage2),候选(stage3),完成.

在 ts4 下,装饰器处于 stage2 阶段,写法也就是

```ts
// 类装饰器
function ClassDecorator(target: any) {}
// 方法装饰器
function MethodDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {}
// 访问器装饰器
function ConfigDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {}
// 属性装饰器
function PropertyDecorator(target: any, propertyKey: string) {}
// 参数装饰器
function ParamDecorator(
  target: any,
  propertyKey: string,
  parameterIndex: number
) {}
```

并切需要在 `tsconfig.json` 中开启 `experimentalDecorators` 选项.如果要使用`metadata` 元数据,还需要开启 `emitDecoratorMetadata` 选项.

而在 ts5 下,装饰器处于 stage3 阶段,全部装饰器都接受两个参数，一个是 value，另一是 context

- value：所装饰的对象。
- context：上下文对象，TypeScript 提供一个原生接口 ClassMethodDecoratorContext，描述这个对象。

```ts
type Decorator = (
  value: DecoratedValue,
  context: {
    kind: string; // 表示所装饰对象的类型,可能取以下的值 'class'|'method'|'getter'|'setter'|'field'|'accessor'
    name: string | symbol; //字符串或者 Symbol 值，所装饰对象的名字，比如类名、属性名等
    addInitializer?(initializer: () => void): void; //用来添加类的初始化逻辑。以前，这些逻辑通常放在构造函数里面，对方法进行初始化，现在改成以函数形式传入 addInitializer()方法。注意，addInitializer()没有返回值。
    static?: boolean; //表示所装饰的对象是否为类的静态成员。
    private?: boolean; //表示所装饰的对象是否为类的私有成员。
    metadata: any; // 表示设置的元数据
    access: {
      get?(): unknown;
      set?(value: unknown): void;
    }; //包含了某个值的 get 和 set 方法。
  }
) => void | ReplacementValue;

function Decorator(value: any, context: ClassMethodDecoratorContext) {}
```

要使用 stage3 的装饰器,首先需要安装 typescript@5 版本. 然后将`tsconfig.json`中的`experimentalDecorators`和`emitDecoratorMetadata`注释掉. 如果在 vscode 中使用还需要确保 vscode 使用的 typescript 和 tsServer 版本也是 5 以上的版本. 因为 tsServer 是 ts 的语言服务,用来检查代码的,果使用的是旧版本的 tsServer,会导致 vscode 无法识别装饰器. tsServer 内部会调用 SDK 进行检查,这个 SDK 是可以设置的

通过 `ctrl + shift + p` 打开命令面板,打开用户设置面板,搜索`tsdk`,比如要设置项目中安装的 typescript 作为 SDK,就可以填写路径`./node_modules/typescript/lib`.(配置完之后记得重启一下 vscode,可以`ctrl + shift + p`打开命令面板,输入`reload window`)

也可以直接在 vscode 的又下角点击 `{}TypeScrip` 的 `{}`进行切换,或者通过 `ctrl + shift + p` 打开命令面板,输入`TypeScript: Select TypeScript version`,选择要使用的版本.

![alt text](./README/image.png)

如果只想改项目中的 tsServer 的 sdk,可以在项目的根目录下创建一个`.vscode/settings.json`文件,在文件中添加`"typescript.tsdk": "./node_modules/typescript/lib"`即可.
