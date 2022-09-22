## Dapp 项目问题发现与调整

- 业务功能拆分问题与调整方案；
- Dapp 内逻辑交互层改善；
- 开发适用于 新版UI 的组件库;

### 业务功能拆分问题与调整方案

- solv-libs
  - 现有模块拆分从过去开发上来看，各模块依赖耦合过重，导致更新其中一个包，会牵连多个依赖包更新，导致部署时间加长；
  - 调整：
    - 将 configure 模块，直接配置在前端Dapp项目中；
    - 对现有已拆分出的通用业务模块，结合新需求重新梳理，抽离出通用且少更改的业务单元做封装，数据层采用直接输入输出模式；
- js-sdk
  - 考虑迁移到私仓里

### Dapp 内逻辑交互层改善

- 钱包网络切换后状态与数据更新，现有模式是强制站点刷新，体验上会有些问题
  - 调整：钱包状态更改后，实现站点无刷新更改当前连接状态并响应， 
    - 依赖库 web3-react (现在已归属于 Uniswap Labs 统一维护)；
- 状态管理，沿用已有方案
  - jotai: 作用域 - 组件内部(hook)
  - zustand: 作用域，全局，对于复杂的业务状态管理，可以使用它
- 多语言 linguijs
  - 非 SSR 环境下，只能使用 <Trans id="tip" /> 去配置，且作用域只限于 .tsx 组件内部；
  - SSR 环境下，可以使用
- 引入组件库：react-use
  - https://github.com/streamich/react-use
  - 开源hook库，包含了很多开箱即用的小工具

### 开发适用于 新版UI 的组件库

- mui作为底层Ui库
- 基础组件库开发，例如：Button，Input，Radio，Checkout，Card 等
- 较复杂的组件：
  - Date 日期组件：可以使用第三方库进行封装开发， react-calendar，可定制程度高
  - Table 表格组件：使用 css grid 布局方案，可以解决多数需求
  - DownMenu，Select, 弹出窗等，可以使用 Tippy.js 进行定制化封装开发
    - https://atomiks.github.io/tippyjs/
  - 

### 多个环境沿用现在的方案，多个分支
