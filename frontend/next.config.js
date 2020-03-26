module.exports = {
    devIndicators: {
        autoPrerender: false,
    },
    assetPrefix: process.env.NODE_ENV === "production" ?   '/commander/' : '',
    publicRuntimeConfig: {
        // dev:process.env.NODE_ENV !== 'production' ,
        apiBase: process.env.NODE_ENV === 'production' ? "http://ring.act.buaa.edu.cn/commander/api" : 'http://ring.act.buaa.edu.cn/commander/api'
    }
}