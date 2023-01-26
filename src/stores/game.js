import { defineStore } from "pinia";
import { markRaw } from "vue";
import { ExplorerApi } from "atomicassets";
import * as waxjsLib from "@waxio/waxjs/dist";
import AnchorLink from 'anchor-link';
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application



const anchorTransport = new AnchorLinkBrowserTransport();

export const useGameStore = defineStore("game", {
  state: () => ({
    smartContract: undefined,
    tokenSmart: undefined,
    collectionName: undefined,
    atomicExplorerApi: undefined,
    waxjs: undefined,
    anchorLink: undefined,
    sendAction: async (x)=>{console.log('send actions'),console.log(x);},
    userName: undefined,
    userAuth: [],
    historyEndpoint: undefined,

    tables: {
      //configs

      gamecfg: undefined,

      shop: [],
      boxes: [],
      tools: [],


      // stats
      stat: undefined,
      stakestat: undefined,

      users: [],
      usertools: [],

      staking: [],
      refund: [],

      /*
      stake: [],
      stakebyamount: [],
      */


      usersbyrate: [],
      usersbystake: [],
    },

    walletAssets: [],
    inventoryAssets: [],
    collectionTemplates: [],
    walletBalances: [],

    withdrawActions: [],
    depositActions: [],

    // ...
  }),
  getters: {
    gameConfig: (state) => state.tables.gamecfg,
    gameStat: (state) => state.tables.stat,
    stakeStat: (state) => state.tables.stakestat,
    player: (state) => {

      if(state.tables.users[0]){
        return state.tables.users[0];
      }else{
        return {
          wallet: state.userName,
          balances: [],
          exchange_time: "1970-01-01T00:00:00",
          sum_rate: "0.00000000 EAT",
          stakeidx: "0.00000000 EMT"
        }
      }
      
    },
    playerStake: (state) => {

      if(state.tables.staking[0]){
        return state.tables.staking[0];
      }else{
        return {
          wallet: state.userName,
          stake: "0.00000000 EMT",
          accumulated: "0.00000000 EWT",
          accumulate_point: "1970-01-01T00:00:00",
          accumulate_rate: "0.00000000 EWT"
        }
      }
    },
    playerUsedTools: (state) => state.tables.usertools,
    leaderboardRate: (state) => state.tables.usersbyrate,
    //leaderboardStake: (state) => state.tables.usersbystake,
    leaderboardStake: (state) => state.tables.stakingbystake,
    playerRefunds: (state) => state.tables.refund,


    shopList: (state) => state.tables.shop,
    boxesList: (state) => state.tables.boxes,
    toolsList: (state) => state.tables.tools,


    playerBoxes: (state) =>
      state.getAssetsByTemplateConfigTable(state.boxesList, [
        ...state.inventoryAssets,
        ...state.walletAssets,
      ]),
    playerTools: (state) =>
      state.getAssetsByTemplateConfigTable(state.toolsList, [
        ...state.inventoryAssets,
        ...state.walletAssets,
      ]),

    rarityNamedList: (state) => {
        let list = [];

        let rarityExamples = state.collectionTemplates.filter(t => t.immutable_data.Rarity);

        for(let config of state.toolsList){
            if(!list.find(e => e.value == config.rarity)){

                let exampleTemplate = rarityExamples.find((templ) => {
                    return templ.template_id == config.template_id;
                })
                list.push({name:exampleTemplate.immutable_data.Rarity, value: config.rarity});
            }
        }

        return list;
    },

    gameAssetsIds: (state) => {
      let gameAssetIds = [];

      gameAssetIds.push(...state.playerUsedTools.map(t => t.asset_id));

      gameAssetIds = gameAssetIds.filter((id) => id != 0);

      return gameAssetIds;
    },
    gameAssetsIdsFromState:(oldstate) =>{return ({usertools = oldstate.tables.usertools}) => {
      let gameAssetIds = [];

      gameAssetIds.push(...usertools.map(t => t.asset_id));
      gameAssetIds = gameAssetIds.filter((id) => id != 0);
      return gameAssetIds;
    }},

    balanceEAT: (state) => {
      if (!state.player) return 0;
      return state.findBalance(state.player.balances, "EAT");
    },
    balanceEET: (state) => {
      if (!state.player) return 0;
      return state.findBalance(state.player.balances, "EET");
    },
    balanceEMT: (state) => {
      if (!state.player) return 0;
      return state.findBalance(state.player.balances, "EMT");
    },
    balanceMEAT: (state) => {
      if (!state.player) return 0;
      return state.findBalance(state.player.balances, "MEAT");
    },

    findBalance: (state) => {
      return (balances, sym) => {
        let balance = balances.find((bal) => bal.split(" ")[1] == sym);
        if (balance) {
          return +balance.split(" ")[0];
        } else {
          return 0;
        }
      };
    },

    walletBalanceEAT: (state) => {
      return state.findBalance(state.walletBalances, "EAT");
    },
    walletBalanceEET: (state) => {
      return state.findBalance(state.walletBalances, "EET");
    },
    walletBalanceEMT: (state) => {
      return state.findBalance(state.walletBalances, "EMT");
    },
    walletBalanceMEAT: (state) => {
      return state.findBalance(state.walletBalances, "MEAT");
    },
    walletBalanceWAX: (state) => {
      return state.findBalance(state.walletBalances, "WAX");
    },

    getCurrentSeconds() {
      return () => {return Math.floor(Date.now() / 1000)};
    },
    ISOToSeconds() {
      return (datestring) => {return Math.floor(new Date(datestring + "Z").getTime() / 1000)};
    },


    sleep() {
      return async (ms = 1000) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
    },

    getTableRows: (state) => {

      return async (
        contract,
        scope,
        table,
        limit = 100,
        lowerBound = "",
        upperBound = "",
        indexPosition = 1,
        keyType = `i64`,
        reverse = false
      ) => {
        await state.sleep(100);
        if (limit < 0) {
          let resultRows = [];
  
          let loopLowerBound = lowerBound;
  
          while (true) {
            let res = await state.waxjs.rpc.get_table_rows({
              json: true,
              code: contract,
              scope: scope,
              table: table,
              lower_bound: loopLowerBound,
              upper_bound: upperBound,
              limit: 100,
              reverse: reverse,
              show_payer: false,
              index_position: indexPosition,
              key_type: keyType,
            });
  
            resultRows = [...resultRows, ...res.rows];
  
            loopLowerBound = res.next_key;
  
            if (!res.more) {
              break;
            }
          }
  
          return resultRows;
        } else {
          let res = await state.waxjs.rpc.get_table_rows({
            json: true,
            code: contract,
            scope: scope,
            table: table,
            lower_bound: lowerBound,
            upper_bound: upperBound,
            limit: limit,
            reverse: reverse,
            show_payer: false,
            index_position: indexPosition,
            key_type: keyType,
          });
  
          return res.rows;
        }
      }
    },

    getSmartTables: function (state) {
      return {
        //tables configs

        async gamecfg() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "global",
            1
          );
          return rows;
        },

        

        async shop() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "shop",
            -1
          );
          return rows;
        },

        async boxes() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "boxes",
            -1
          );
          return rows;
        },
        async tools() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "tools",
            -1
          );
          return rows;
        },
 

        //tables actions


        //tables stats

        async users(player = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "users",
            1,
            player,
            player
          );
          return rows;
        },
        async usersbyrate() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "users",
            100,
            undefined,
            undefined,
            2,
            undefined,
            true
          );
          return rows;
        },
        async usersbystake() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "users",
            10,
            undefined,
            undefined,
            3,
            undefined,
            true
          );
          return rows;
        },

        async staking(player = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "staking",
            1,
            player,
            player
          );
          return rows;
        },
        async stakingbystake(player = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "staking",
            50,
            undefined,
            undefined,
            2,
            undefined,
            true
          );
          return rows;
        },

        async usertools(user = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            user,
            "usertools",
            -1
          );
          return rows;
        },

        async refund(user = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            user,
            "refund",
            -1
          );
          return rows;
        },

        async stat() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "globalstats",
            1
          );
          return rows;
        },

        async stakestat() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "stakestats",
            1
          );
          return rows;
        },


        // async userstake(user = state.userName) {
        //   let rows = await state.getTableRows(
        //     state.smartContract,
        //     state.smartContract,
        //     "stake",
        //     -1
        //   );
        //   return rows;
        // },

      };
    },

    getSmartActions: function (state) {
      return {
        addtool(asset_ids) {
          let actions = [
            {
              account: "atomicassets",
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                asset_ids: asset_ids,
                memo: `stake tool`,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        openbox(asset_ids) {
          let actions = [
            {
              account: "atomicassets",
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                asset_ids: asset_ids,
                memo: "open box",
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        deposit(quantity) {
          let actions = [
            {
              account: state.tokenSmart,
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                quantity: quantity,
                memo: "deposit",
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        depositwax(quantity) {
          let actions = [
            {
              account: 'eosio.token',
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                quantity: quantity,
                memo: "buy meat",
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        withdraw(quantity) {
          let actions = [
            {
              account: state.smartContract,
              name: "withdraw",
              data: {
                wallet: state.userName,
                quantity: quantity,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        exchange(amount) {
          let actions = [
            {
              account: state.smartContract,
              name: "exchange",
              data: {
                wallet: state.userName,
                amount: amount,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },


        claim(tool_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "claim",
              data: {
                wallet: state.userName,
                tool_id: tool_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        speedup(tool_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "speedup",
              data: {
                wallet: state.userName,
                tool_id: tool_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        retrievetool(tool_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "retrievetool",
              data: {
                wallet: state.userName,
                tool_id: tool_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        buy(product_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "buy",
              data: {
                wallet: state.userName,
                shop_id: product_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        upgradetool(tool_id, improve) {
          let actions = [
            {
              account: state.smartContract,
              name: "upgradetool",
              data: {
                wallet: state.userName,
                tool_id: tool_id,
                improve: improve,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        stake(quantity) {
          let actions = [
            {
              account: state.smartContract,
              name: "stake",
              data: {
                wallet: state.userName,
                quantity: quantity,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        unstake(quantity) {
          let actions = [
            {
              account: state.smartContract,
              name: "unstake",
              data: {
                wallet: state.userName,
                quantity: quantity,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        refund() {
          let actions = [
            {
              account: state.smartContract,
              name: "refund",
              data: {
                wallet: state.userName,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        claimewt() {
          let actions = [
            {
              account: state.smartContract,
              name: "claimewt",
              data: {
                wallet: state.userName,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

      };
    },





    fetchWalletBalances: (state) => {
      return async () => {
        let balance = [
          ...(await state.waxjs.rpc.get_currency_balance(
            state.tokenSmart,
            state.userName
          )),
          ...(await state.waxjs.rpc.get_currency_balance(
            'eosio.token',
            state.userName
          )),
        ];
        return balance;
      }
    },

    assetIdsToAtomicAssets: (state) => {
      return async (assetIds) => {
        if (assetIds.length < 1) {
          return [];
        }


        let pages = [];
        let all = assetIds;

        while(all.length > 0){

          let part = all.splice(0, 100);

          pages.push(part);
        }



        let allItems = [];
        for(let page of pages){
          let atomicItems = await state.atomicExplorerApi.getAssets(
            {
              ids: page.join(','),
            },
            1,
            100
          );

          allItems.push(...atomicItems);

        }
        

        
        return allItems;
      }
    },

    fetchWalletAssets: (state) => {
      return async () => {

        let allAssets = []

        for(let page = 1;true; page++){

          let atomicItems = await state.atomicExplorerApi.getAssets(
            {
              owner: state.userName,
              collection_name: state.collectionName,
            },
            page,
            100
          );

          if(atomicItems.length == 0) break;

          allAssets.push(...atomicItems);

        }
        
        return allAssets;
      }
    },

    getAssetsByTemplateConfigTable: (state) => {
      return (configTable, inventoryAssets) => {
        let result = [];
        let configTemplates = configTable.map((tableRow) => {
          return +tableRow["template_id"];
        });
        inventoryAssets = inventoryAssets.filter((asset) => {
          return configTemplates.includes(+asset["template"]["template_id"]);
        });

        for (let item of inventoryAssets) {
          let resultRow = Object.assign({}, item);

          let templateId = +resultRow["template"]["template_id"];
          resultRow.config = configTable.find((configRow) => {
            return templateId == configRow["template_id"];
          });

          result.push(resultRow);
      }

      return result;
      }
    },

    calcAccumulateRate: (state) => {
      return (configRow, level) => {
        let rate = +configRow.base_rate.split(' ')[0];


        let genMultipliers = state.gameConfig.gen_multipliers;

        let genMultiplier = genMultipliers.find(m => m.gen == configRow.gen);

        if(!genMultiplier) return 0;

        for(let i = 0; i < level; i++){
            let multiplier = state.calcUpdMultiplier(genMultiplier.upgrade_multipliers, i);

            if(!multiplier) break;

            rate *= (multiplier.multiplier_rate / 100000000.0);
        }
        return rate;
      }
    },
    calcUpdMultiplier: (state) => {
      return (multipliers, level) => {
        let multiplier = multipliers.find(m => m.level == level);
        return multiplier;
      }
    },
    calcUpgradePaid: (state) => {
      return (configRow, oldLevel, newLevel) => {

        let time = configRow.base_time;
        let cost = +configRow.base_cost.split(' ')[0];
        let speedup = +configRow.base_speedup_cost.split(' ')[0];
        let configAdditional = +configRow.additional_cost.split(' ')[0];

        
        let finalTime = 0;
        let finalCost = 0;
        let finalSpeedup = 0;
        let additionalCost = 0;


        let genMultipliers = state.gameConfig.gen_multipliers;

        let genMultiplier = genMultipliers.find(m => m.gen == configRow.gen);

        if(!genMultiplier) return {balance: [`0 ${configRow.base_cost.split(' ')[1]}`], time: 0, speedup: `0 ${configRow.base_speedup_cost.split(' ')[1]}`};

        for(let i = 0; i < oldLevel; i++){
            let multiplier = state.calcUpdMultiplier(genMultiplier.upgrade_multipliers, i);

            if(!multiplier) break;

            time *= (multiplier.multiplier_time / 100000000.0);
            cost *= (multiplier.multiplier_cost / 100000000.0);
            speedup *= (multiplier.multiplier_speedup / 100000000.0);
        }


        for(let i = oldLevel; i < newLevel; i++){
            let multiplier = state.calcUpdMultiplier(genMultiplier.upgrade_multipliers, i);

            if(!multiplier) break;

            time *= (multiplier.multiplier_time / 100000000.0);
            finalTime += time;

            cost *= (multiplier.multiplier_cost / 100000000.0);
            finalCost += cost;

            speedup *= (multiplier.multiplier_speedup / 100000000.0);
            finalSpeedup += speedup;

            if(multiplier.additional_cost){
              additionalCost += configAdditional;
            }
        }



        let finalAssetCost = `${finalCost.toFixed(8)} ${configRow.base_cost.split(' ')[1]}`;
        let additionalAssetCost = `${additionalCost.toFixed(8)} ${configRow.additional_cost.split(' ')[1]}`;
        let finalAssetSpeedup = `${finalSpeedup.toFixed(8)} ${configRow.base_speedup_cost.split(' ')[1]}`;

        let fullCost = [finalAssetCost, additionalAssetCost];

        return {balance: fullCost, time: finalTime, speedup: finalAssetSpeedup};
      }
    },

  },
  actions: {

    init({
      smartContract,
      tokenSmart,
      collectionName,

      apiEndpoint,
      atomicEndpoint,
      historyEndpoint,
      chainId
    }) {

      apiEndpoint = apiEndpoint ?? "https://api.waxtest.alohaeos.com";
      historyEndpoint = historyEndpoint ?? "https://wax-testnet-hyperion.neftyblocks.com";
      atomicEndpoint = atomicEndpoint ?? "https://test.wax.eosusa.io";
      chainId = chainId ?? "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12";



      this.smartContract = smartContract ?? "earlygamesss";
      this.tokenSmart = tokenSmart ?? "earlytokenss";
      this.collectionName = collectionName ?? "earlyempires";
      this.historyEndpoint = historyEndpoint;
      this.atomicExplorerApi = markRaw(new ExplorerApi(atomicEndpoint, "atomicassets", { fetch }));
      this.waxjs = markRaw(new waxjsLib.WaxJS({
        rpcEndpoint: apiEndpoint,
        tryAutoLogin: false,
      }));

      this.anchorLink = markRaw(new AnchorLink({
        transport: anchorTransport,
        chains: [{
          chainId: chainId,
          nodeUrl: apiEndpoint,
        }]
      }));
    },

    async login({
      apiEndpoint,
      atomicEndpoint,
      historyEndpoint,
      chainId,
      walletType
    } = {}){


      this.init({
        apiEndpoint,
        atomicEndpoint,
        historyEndpoint,
        chainId
      });

      let walletName, auth, sendAction;

      if (walletType == 'wax') {
        async function sendActionWax(actions) {
          if (!this.waxjs.api) await this.waxjs.login();
          let res = await this.waxjs.api.transact({ actions: actions }, { blocksBehind: 3, expireSeconds: 120, });
          return res.transaction_id;
        }

        walletName = await this.waxjs.login();
        auth = [{
          actor: walletName,
          permission: 'active',
        }];
        sendAction = sendActionWax;
      } else {

        let res = await this.anchorLink.identify({scope:this.smartContract});

        walletName = res.signer.actor;
        auth = [res.signer];
        sendAction = async function(actions){
          let res = await this.anchorLink.transact({ actions: actions });
          return res.processed.id;
        }

      }

      this.sendAction = sendAction;
      this.userName = walletName;
      this.userAuth = auth;
    },
    async restoreFromStorage({
      apiEndpoint,
      atomicEndpoint,
      historyEndpoint,
      chainId,
      name = "game",
    } = {}) {

      let storageData = localStorage.getItem(name);

      if (!storageData) {
        throw {message:"autologin failed"}
      }
      storageData = JSON.parse(storageData);

      let walletType = storageData.restore.wallet;


      this.init({
        apiEndpoint,
        atomicEndpoint,
        historyEndpoint,
        chainId
      });

      if (walletType == 'wax') {
        async function sendActionWax(actions) {
          if (!this.waxjs.api) await this.waxjs.login();
          let res = await this.waxjs.api.transact({ actions: actions }, { blocksBehind: 3, expireSeconds: 120, });
          return res.transaction_id;
        }
        this.sendAction = sendActionWax;

      } else {


        let ses = await this.anchorLink.restoreSession(this.smartContract);

        if(ses){
          let anchorSession = ses;
          this.sendAction = async function(actions){
            let res = await anchorSession.transact({ actions: actions });
            return res.processed.id;
          }
        }else{
          this.sendAction = async function(actions){
            let res = await this.anchorLink.transact({ actions: actions });
            return res.processed.id;
          }
        }
        

        //this.sendAction = sendActionAnchor;
      }





      let initObj = storageData.init;
      this.userName = initObj.userName;
      this.userAuth = initObj.userAuth;



      let confObj = storageData.conf;
      let statObj = storageData.stat;

      let statExpiration = undefined;
      let confExpiration = undefined;

      let curSecs = this.getCurrentSeconds();

      if (confObj.expDate >= curSecs) {
        confExpiration = confObj.expDate - curSecs;
        this.tables.gamecfg = confObj.tables.gamecfg;
        this.tables.boxes = confObj.tables.boxes;
        this.tables.shop = confObj.tables.shop;
        this.tables.tools = confObj.tables.tools;

        this.collectionTemplates = confObj.collectionTemplates;
      } else {
        await this.loadconfigs();
      }

      if (statObj.expDate >= curSecs) {
        statExpiration = statObj.expDate - curSecs;
        this.tables.users = statObj.tables.users;
        this.tables.usertools = statObj.tables.usertools;
        this.tables.usersbyrate = statObj.tables.usersbyrate;
        this.tables.usersbystake = statObj.tables.usersbystake;

        this.tables.staking = statObj.tables.staking;
        this.tables.stakingbystake = statObj.tables.stakingbystake;
        this.tables.refund = statObj.tables.refund;


        this.tables.stat = statObj.tables.stat;
        this.tables.stakestat = statObj.tables.stakestat;



        this.inventoryAssets = statObj.inventoryAssets;
        this.walletAssets = statObj.walletAssets;

        this.walletBalances = statObj.walletBalances;
      } else {
        await this.loadstats();
      }

      this.saveToStorage({
        walletType: walletType,
        confExpiration: confExpiration,
        statExpiration: statExpiration
      })
    },
    saveToStorage({
      confExpiration = 600,
      statExpiration = 60,
      itemName = "game",
      walletType = "wax",
    }) {
      let data = {
        init: {
          collectionName: this.collectionName,
          smartContract: this.smartContract,
          tokenSmart: this.tokenSmart,
          userName: this.userName,
          userAuth: this.userAuth,
          historyEndpoint: this.historyEndpoint,
        },
        conf: {
          expDate: Date.now() / 1000 + confExpiration,
          tables: {
            gamecfg: this.tables.gamecfg,
            shop: this.tables.shop,
            tools: this.tables.tools,
            boxes: this.tables.boxes,
          },
          collectionTemplates: this.collectionTemplates,
        },
        stat: {
          expDate: Date.now() / 1000 + statExpiration,
          tables: {
            users: this.tables.users,
            usertools: this.tables.usertools,
            stat: this.tables.stat,
            usersbyrate: this.tables.usersbyrate,
            usersbystake: this.tables.usersbystake,
            refund: this.tables.refund,
            staking: this.tables.staking,
            stakingbystake: this.tables.stakingbystake,
            stakestat: this.tables.stakestat,
          },
          inventoryAssets: this.inventoryAssets,
          walletAssets: this.walletAssets,
          walletBalances: this.walletBalances,
        },
        restore: {
          wallet: walletType,
        },
      };

      let jsonData = JSON.stringify(data);
      localStorage.setItem(itemName, jsonData);
    },
    logout({ itemName = "game" }={}) {
      this.$reset();
      localStorage.removeItem(itemName);
    },

    async loadconfigs() {


      let gamecfg = (await this.getSmartTables.gamecfg())[0];
      let boxes = await this.getSmartTables.boxes();
      let shop = await this.getSmartTables.shop();
      let tools = await this.getSmartTables.tools();

      let collectionTemplates = await this.atomicExplorerApi.getTemplates(
        {
          collection_name: this.collectionName,
        },
        1,
        500
      );

      this.$patch((state) => {
        state.tables.gamecfg = gamecfg;
        state.tables.boxes = boxes;
        state.tables.shop = shop;
        state.tables.tools = tools;
        state.collectionTemplates = collectionTemplates;
      });
    },
    async loadstats() {
      this.tables.users = await this.getSmartTables.users();
      // if (this.tables.users.length < 1) {
      //   console.log("Player is not registered");
      //   throw { message: "Player is not registered", code: 1 };
      // }

      
      let usertools = await this.getSmartTables.usertools();

      let refund = await this.getSmartTables.refund();
      let staking = await this.getSmartTables.staking();
      let stakingbystake = await this.getSmartTables.stakingbystake();
      
      let usersbyrate = await this.getSmartTables.usersbyrate();
      let usersbystake = await this.getSmartTables.usersbystake();

      let stat = ( await this.getSmartTables.stat())[0];
      let stakestat = ( await this.getSmartTables.stakestat())[0];

      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({usertools: usertools})
      );

      let walletAssets = await this.fetchWalletAssets();

      let walletBalances = await this.fetchWalletBalances();


      this.$patch((state) => {
        state.tables.usertools = usertools;
        state.tables.usersbyrate = usersbyrate;
        state.tables.usersbystake = usersbystake;
        state.tables.staking = staking;
        state.tables.stakingbystake = stakingbystake;
        state.tables.usertools = usertools;
        state.tables.stat = stat;
        state.tables.stakestat = stakestat;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
        state.walletBalances = walletBalances;
      });




    },


    //game actions

    async deposit(quantity) {
      await this.sendAction(this.getSmartActions.deposit(quantity));
      await this.sleep();



      let users = await this.getSmartTables.users();
      let walletBalances = await this.fetchWalletBalances();

      this.$patch((state) => {
        state.tables.users = users;

        state.walletBalances = walletBalances;
      });

    },
    async depositWax(quantity) {
      await this.sendAction(this.getSmartActions.depositwax(quantity));
      await this.sleep();

      let users = await this.getSmartTables.users();
      let walletBalances = await this.fetchWalletBalances();

      this.$patch((state) => {
        state.tables.users = users;

        state.walletBalances = walletBalances;
      });

    },
    async withdraw(quantity) {
      await this.sendAction(this.getSmartActions.withdraw(quantity));
      await this.sleep();

      let users = await this.getSmartTables.users();
      let walletBalances = await this.fetchWalletBalances();

      this.$patch((state) => {
        state.tables.users = users;

        state.walletBalances = walletBalances;
      });
    },
    async exchange(quantity) {
      await this.sendAction(this.getSmartActions.exchange(quantity));
      await this.sleep();

      let users = await this.getSmartTables.users();

      this.$patch((state) => {
        state.tables.users = users;
      });
    },


    async addTool(assetIds) {
      await this.sendAction(this.getSmartActions.addtool(assetIds));
      await this.sleep();


      let users = await this.getSmartTables.users();
      let usertools = await this.getSmartTables.usertools();

      let walletAssets = await this.fetchWalletAssets();
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({usertools:usertools})
      );

      this.$patch((state) => {
        state.tables.users = users;
        state.tables.usertools = usertools;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },
    async removeTool(toolId) {
      await this.sendAction(this.getSmartActions.retrievetool(toolId));
      await this.sleep();

      let users = await this.getSmartTables.users();
      let usertools = await this.getSmartTables.usertools();

      let walletAssets = await this.fetchWalletAssets();
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({usertools: usertools})
      );

      this.$patch((state) => {
        state.tables.users = users;
        state.tables.usertools = usertools;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },
    async upgradeTool(toolId, levels) {
      await this.sendAction(this.getSmartActions.upgradetool(toolId, levels));
      await this.sleep();


      let users = await this.getSmartTables.users();
      let usertools = await this.getSmartTables.usertools();

      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIds
      );

      this.$patch((state) => {
        state.tables.users = users;
        state.tables.usertools = usertools;

        state.inventoryAssets = inventoryAssets;
      });


    },
    async speedUp(toolId) {
      await this.sendAction(this.getSmartActions.speedup(toolId));
      await this.sleep();

      let users = await this.getSmartTables.users();
      let usertools = await this.getSmartTables.usertools();

      this.$patch((state) => {
        state.tables.users = users;
        state.tables.usertools = usertools;
      });
    },

    async removeAllTools() {


      let actions = [];

      let curSecs = this.getCurrentSeconds();

      let tools = this.playerUsedTools.slice();

      tools = tools.filter((tool)=>{
        return this.ISOToSeconds(tool.upgrade_end) < curSecs;
      })



      for(let tool of tools.splice(0,50)){
          actions.push(...this.getSmartActions.retrievetool(tool.asset_id));
      }


      await this.sendAction(actions);
      await this.sleep();

      let users = await this.getSmartTables.users();
      let usertools = await this.getSmartTables.usertools();

      let walletAssets = await this.fetchWalletAssets();
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({usertools: usertools})
      );

      this.$patch((state) => {
        state.tables.users = users;
        state.tables.usertools = usertools;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },


    async openBox(assetIds) {
      await this.sendAction(this.getSmartActions.openbox(assetIds));
      await this.sleep();

      async function check(game) {
        let returnedAssets = await game.assetIdsToAtomicAssets([assetIds[0]]);
        let checkAsset = returnedAssets[0];
        return Boolean(checkAsset && checkAsset["owner"]);
      }

      let checkChange = await check(this);
      while (checkChange) {
        await this.sleep();
        checkChange = await check(this);
      }

      let newWalletAssets = await this.fetchWalletAssets();

      let addedAssets = newWalletAssets.filter((itemRow) => {
        return !this.walletAssets.some(
          (oldItemRow) => itemRow["asset_id"] == oldItemRow["asset_id"]
        );
      });

      this.walletAssets = newWalletAssets;
      return addedAssets;
    },


  
    async claim(toolId) {
      await this.sendAction(this.getSmartActions.claim(toolId));
      await this.sleep();

      let users = await this.getSmartTables.users();
      let usertools = await this.getSmartTables.usertools();


      this.$patch((state) => {
        state.tables.users = users;
        state.tables.usertools = usertools;
      });

    },

    async claimAll() {


      let actions = [];

      let curSecs = this.getCurrentSeconds();

      let tools = this.playerUsedTools.slice();


      let secs = this.getCurrentSeconds();

      tools = tools.filter((tool)=>{
        return this.ISOToSeconds(tool.upgrade_end) < curSecs;
      })

      tools.sort((a, b)=>{
        let aVal = calcUnclaimed(a, secs, this);
        let bVal = calcUnclaimed(b, secs, this);

        return bVal - aVal;
      });



      for(let tool of tools.splice(0,50)){
          actions.push(...this.getSmartActions.claim(tool.asset_id));
      }

      await this.sendAction(actions);
      await this.sleep();

      let users = await this.getSmartTables.users();
      let usertools = await this.getSmartTables.usertools();


      this.$patch((state) => {
        state.tables.users = users;
        state.tables.usertools = usertools;
      });

      function calcUnclaimed(tool, secs, state){
        let accumulated = +tool.accumulated.split(' ')[0];
          let accumulateRate = +tool.accumulate_rate.split(' ')[0];
          let elastedSeconds = secs - state.ISOToSeconds(tool.accumulate_point);

          let ticksCount = elastedSeconds / (state.gameConfig?.accumulate_tick ?? 1);

          let resultIncome = accumulated + accumulateRate * ticksCount;

          return resultIncome;
    }
    },

    async buy(id) {
      await this.sendAction(this.getSmartActions.buy(id));
      await this.sleep();

      let users = await this.getSmartTables.users();
      let shop = await this.getSmartTables.shop();

      let newWalletAssets = await this.fetchWalletAssets();
      
      let addedAssets = newWalletAssets.filter((itemRow) => {
        return !this.walletAssets.some(
          (oldItemRow) => itemRow["asset_id"] == oldItemRow["asset_id"]
        );
      });


      this.$patch((state) => {
        state.tables.users = users;
        state.tables.shop = shop;

        state.walletAssets = newWalletAssets;
      });

      return addedAssets;
    },













    async stake(quantity) {
      await this.sendAction(this.getSmartActions.stake(quantity));
      await this.sleep();

      let users = await this.getSmartTables.users();
      let staking = await this.getSmartTables.staking();
      let stakingbystake = await this.getSmartTables.stakingbystake();
      let stakestat = await this.getSmartTables.stakestat();


      this.$patch((state) => {
        state.tables.users = users;
        state.tables.staking = staking;
        state.tables.stakingbystake = stakingbystake;
        state.tables.stakestat = stakestat;
      });

    },
    async unstake(quantity) {
      await this.sendAction(this.getSmartActions.unstake(quantity));
      await this.sleep();

      let users = await this.getSmartTables.users();
      let staking = await this.getSmartTables.staking();
      let stakingbystake = await this.getSmartTables.stakingbystake();
      let stakestat = await this.getSmartTables.stakestat();
      let refund = await this.getSmartTables.refund();


      this.$patch((state) => {
        state.tables.users = users;
        state.tables.staking = staking;
        state.tables.stakingbystake = stakingbystake;
        state.tables.stakestat = stakestat;
        state.tables.refund = refund;
      });

    },
    async refund() {
      await this.sendAction(this.getSmartActions.refund());
      await this.sleep();

      let users = await this.getSmartTables.users();
      let refund = await this.getSmartTables.refund();


      this.$patch((state) => {
        state.tables.users = users;
        state.tables.refund = refund;
      });

    },
    async claimEwt() {
      await this.sendAction(this.getSmartActions.claimewt());
      await this.sleep();

      let users = await this.getSmartTables.users();
      let staking = await this.getSmartTables.staking();


      this.$patch((state) => {
        state.tables.users = users;
        state.tables.staking = staking;
      });

    },


















    async updateGlobalStat() {
      this.tables.stat = (await this.getSmartTables.stat())[0];
    },
    async updateRateLeaders() {
      this.tables.usersbyrate = await this.getSmartTables.usersbyrate();
    },

    

    
  },
});
