export const ONL_CONFIG = {
  url: 'http://47.117.46.26:3000',
  proxy_urls: [
    // 'https://poe2flip.poe2flip-proxy.workers.dev',
    // 'https://1304698797-5zhnvx5dsm.ap-shanghai.tencentscf.com',
    // 'https://1304698797-2eqgfz25o3.ap-hongkong.tencentscf.com',
    // 'https://1304698797-gqqolsszn8.ap-beijing.tencentscf.com',
    // 'https://1304698797-jg72xziz5f.ap-guangzhou.tencentscf.com',
    // 'https://1304698797-0of6r7cxe8.ap-chengdu.tencentscf.com',
    // 'https://1304698797-11gvl9ocrh.ap-nanjing.tencentscf.com',
    // 'https://1304698797-csoq4112r9.ap-tokyo.tencentscf.com',
    // 'https://1304698797-beycwwerbc.ap-seoul.tencentscf.com',
    // 'https://1304698797-enve5w6uq9.ap-singapore.tencentscf.com',

    'https://1304698797-3asi2q8s4t.ap-bangkok.tencentscf.com', // 曼谷intl1
    'https://1304698797-lp9grfdb47.na-siliconvalley.tencentscf.com', // 硅谷intl2
    'https://1304698797-2hqs179d3x.ap-singapore.tencentscf.com', // 新加坡intl3
    'https://1304698797-bt4tj7iwgs.ap-jakarta.tencentscf.com', // 雅加达intl4
    'https://1304698797-cina5go34n.eu-frankfurt.tencentscf.com', // 法兰克福intl5
    'https://1304698797-0m6e4jsbse.ap-seoul.tencentscf.com', // 首尔intl6
    'https://1304698797-5hcxgs25bl.ap-tokyo.tencentscf.com', // 东京intl7
    'https://1304698797-2u4lkz5aqo.na-ashburn.tencentscf.com', //弗吉尼亚intl8,
    'https://1304698797-1stc7y7zmh.ap-hongkong.tencentscf.com', // 香港intl9
  ],
  'flip.save.currency': '/currencyExchange/add',
  'flip.get.history.currency': '/currencyExchange/queryHistory',
  'flip.query.historyEquipment': '/tradeHistory/search',
  'flip.get.builds': '/builds/query',
  'flip.save.feedback': '/feedback/add',
  'flip.query.top100': '/tradeCurrent/queryTop100',
}