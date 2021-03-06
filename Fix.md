### 1.这里我们使用了if/else判断来解决程序调用和CLI调用的extract-text-webpack-plugin的不一致，但是程序调用的时候完全设置为common.css而不能添加任何hash

### 2.markdown文件等都不要安装了，减少安装大小

### 3.在指定loader的时候不能使用exclude,否则webpack-merge不能合并，导致jsx的多个use无法完全合并从而导致重复。同时合并的时候也无法使用require.resolve，否则也是不可以合并的

```js
    exclude: function(path){
               var isNpmModule=!!path.match(/node_modules/);
               return isNpmModule;
            },
```

### 4.plugin等也要去重

### 5.plugins和loaders去重了，其他的字段我还没有merge

### 6.如何对babel配置进行修改，添加.babelrc是否可以。我们使用一个webpackMerge进行合并

```js
 {
    "presets": [
    ],
    "plugins": [
      "react-hot-loader/babel"
    ]
  }
```

如果需要如下:

```js
{
  "presets": [
    ["es2015", { "modules": false }],
    "react",
    "airbnb"
  ],
  "plugins": [
    "transform-decorators-legacy",
    "transform-object-rest-spread",
    "react-hot-loader/babel"
  ],
  "env": {
    "test": {
      "plugins": [
        "transform-decorators-legacy",
        "transform-object-rest-spread",
        "istanbul"
      ]
    }
  }
}
```

# 多学学include和exclude来提升效率
# build方法应该允许外部调用来获取通用的webpack配置，build添加一个参数，第三个参数

# 使用definePlugin来判断是否要开启react-hot

```js
   new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"production"'
        }),
```

是不是用了这个插件就可以直接在浏览器代码中直接判断了

# 在yo-react中也使用了DefinePlugin

```js
plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"test"'
        })
      ]
```

# 不要将babel-loader作为dependencies而是要作为devDependencies
我们的两个loader即使是去掉exclude也是无法正常合并的，所以会导致两个规则被保留。最后解决方法是：wcf中不要求安装babel-loader，而是作为devDependencies，这样安装我们的webpackcc的时候不会安装babel-loader，最后我们require.resolve得到的都是同一个最高级的文件下的babel-loader。而且此时合并的时候options也会合并:

```js
 cacheDirectory: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp' } }
 //即最后我们的cacheDirectory也会在options上
```


# exclude必须是path.resolve
 exclude :path.resolve("node_modules")。我们的webpackcc只是被调用而已，所以其path.resolve和我们自己配置的path.resolve其实是同一个node_modules路径，这一点一定更要注意!

 # 最好实现钩子函数来在打包之前根据constructor删除某一个plugin

# 老是显示找不到babel-loader模块

# 将webpack作为dependencies安装吧，不要每次都需要安装它
