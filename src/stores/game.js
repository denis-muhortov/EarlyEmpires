import { defineStore } from "pinia";
import { ExplorerApi } from "atomicassets";
import * as waxjsLib from "@waxio/waxjs/dist";
import AnchorLink from 'anchor-link';
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useGameStore = defineStore("game", {
  state: () => ({
    smartContract: String,
    tokenSmart: String,
    collectionName: String,
    atomicExplorerApi: {},
    waxjs: {},
    anchorLink: {},
    sendAction: Promise,
    userName: String,
    userAuth: String,
    historyEndpoint: String,

    tables: {
      //configs

      gamecfg: {},

      shop: [],
      boxes: [],
      tools: [],


      // stats
      stat: {},

      users: [],
      usertools: [],

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
    gameStat: (state) => state.tables.gamecfg,
    player: (state) => {

      if(state.tables.users[0]){
        return state.tables.users[0];
      }else{
        return {
          wallet: state.userName,
          balances: [],
          exchange_time: (new Date(0)).toISOString(),
          sum_rate: "0.00000000 EAT",
          stakeidx: "0.00000000 MEAT"
        }
      }
      
    },
    playerUsedTools: (state) => state.tables.usertools,
    leaderboardrate: (state) => state.tables.usersbyrate,
    leaderboardstake: (state) => state.tables.usersbystake,

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
    balanceMEAT: (state) => {
      if (!state.player) return 0;
      return state.findBalance(state.player.balances, "MEAT");
    },
    balanceGEM: (state) => {
      if (!state.player) return 0;
      return state.findBalance(state.player.balances, "GEM");
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
    walletBalanceMEAT: (state) => {
      return state.findBalance(state.walletBalances, "MEAT");
    },
    walletBalanceGEM: (state) => {
      return state.findBalance(state.walletBalances, "GEM");
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
            50,
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

        async usertools(user = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            user,
            "usertools",
            -1
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
                memo: `add tool`,
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
        deposit(quantity) {
          let actions = [
            {
              account: 'eosio.token',
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                quantity: quantity,
                memo: "buy gem",
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        withdraw(amount) {
          let actions = [
            {
              account: state.smartContract,
              name: "withdraw",
              data: {
                wallet: state.userName,
                amount: amount,
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
        }
      };
    },





    fetchWalletBalances: (state) => {
      return async () => {
        let balance = [
          ...(await this.waxjs.rpc.get_currency_balance(
            this.tokenSmart,
            this.userName
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
        let atomicItems = await this.atomicExplorerApi.getAssets(
          {
            ids: assetIds,
          },
          1,
          1000
        );
        return atomicItems;
      }
    },

    getAssetsByTemplateConfigTable: (state) => {
      return async (configTable, inventoryAssets) => {
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
    }

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

      apiEndpoint = apiEndpoint ?? "https://wax-public-testnet.neftyblocks.com";
      historyEndpoint = historyEndpoint ?? "https://wax-testnet-hyperion.neftyblocks.com";
      atomicEndpoint = atomicEndpoint ?? "https://testatomic.3dkrender.com";
      chainId = chainId ?? "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12";



      this.smartContract = smartContract ?? "empires";
      this.tokenSmart = tokenSmart ?? "empires";
      this.collectionName = collectionName ?? "empires";
      this.historyEndpoint = historyEndpoint;
      this.atomicExplorerApi = new ExplorerApi(atomicEndpoint, "atomicassets", { fetch });
      this.waxjs = new waxjsLib.WaxJS({
        rpcEndpoint: apiEndpoint,
        tryAutoLogin: false,
      });

      let transport = new AnchorLinkBrowserTransport();

      let link = new AnchorLink({
        transport,
        chains: [{
          chainId: chainId,
          nodeUrl: apiEndpoint,
        }]
      });

      this.anchorLink = link;
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

        let res = await this.anchorLink.login(this.smartContract);
        let anchorSession = res.session;
        walletName = anchorSession.auth.actor;
        auth = [anchorSession.auth];

        async function sendActionAnchor(actions) {
          let res = await anchorSession.transact({ actions: actions });
          return res.processed.id;
        }

        sendAction = sendActionAnchor;

        
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
    }) {

      let storageData = localStorage.getItem(name);

      if (!storageData) {
        throw "autologin failed"
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

        let res = await this.anchorLink.restoreSession(this.smartContract);

        if(res){
          let anchorSession = res.session;
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

      if (confObj.expDate >= this.getCurrentSeconds()) {
        this.tables.gamecfg = confObj.tables.gamecfg;
        this.tables.crafts = confObj.tables.crafts;
        this.tables.packs = confObj.tables.packs;
        this.tables.captains = confObj.tables.captains;
        this.tables.stations = confObj.tables.stations;
        this.tables.spaceships = confObj.tables.spaceships;
        this.tables.boosts = confObj.tables.boosts;
        this.tables.earlies = confObj.tables.earlies;

        this.collectionTemplates = confObj.collectionTemplates;
      } else {
        await this.loadconfigs();
      }

      if (statObj.expDate >= this.getCurrentSeconds()) {
        this.tables.users = statObj.tables.users;
        this.tables.usercrews = statObj.tables.usercrews;
        this.tables.usercaptains = statObj.tables.usercaptains;
        this.tables.userstationsbyowner = statObj.tables.userstationsbyowner;
        this.tables.userstationsbyuser = statObj.tables.userstationsbyuser;

        this.tables.referralsbyreferral = statObj.tables.referralsbyreferral;
        this.tables.referralsbyreferrer = statObj.tables.referralsbyreferrer;

        this.tables.stationlogs = statObj.tables.stationlogs;

        this.tables.missions = statObj.tables.missions;
        this.inventoryAssets = statObj.inventoryAssets;

        this.walletAssets = statObj.walletAssets;

        this.walletBalances = statObj.walletBalances;

        this.withdrawActions = statObj.withdrawActions;
        this.depositActions = statObj.depositActions;
      } else {
        await this.loadstats();
      }
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
            crafts: this.tables.crafts,
            packs: this.tables.packs,
            captains: this.tables.captains,
            stations: this.tables.stations,
            spaceships: this.tables.spaceships,
            boosts: this.tables.boosts,
            earlies: this.tables.earlies,
          },
          collectionTemplates: this.collectionTemplates,
        },
        stat: {
          expDate: Date.now() / 1000 + statExpiration,
          tables: {
            users: this.tables.users,
            usercrews: this.tables.usercrews,
            usercaptains: this.tables.usercaptains,
            userstationsbyowner: this.tables.userstationsbyowner,
            userstationsbyuser: this.tables.userstationsbyuser,
            referralsbyreferral: this.tables.referralsbyreferral,
            referralsbyreferrer: this.tables.referralsbyreferrer,
            stationlogs: this.tables.stationlogs,
            missions: this.tables.missions,
          },
          inventoryAssets: this.inventoryAssets,
          walletAssets: this.walletAssets,
          walletBalances: this.walletBalances,
          withdrawActions: this.withdrawActions,
          depositActions: this.depositActions,
        },
        restore: {
          wallet: walletType,
        },
      };

      let jsonData = JSON.stringify(data);
      localStorage.setItem(itemName, jsonData);
    },
    logout({ itemName = "game" }) {
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
        1000
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
      
      let usersbyrate = await this.getSmartTables.usersbyrate();
      let usersbystake = await this.getSmartTables.usersbystake();

      let stat = await (this.getSmartTables.stat())[0];

      // ??????????? let stake = await this.getSmartTables.stake();
      


      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({usertools: usertools})
      );

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );

      let walletBalances = await this.fetchWalletBalances();

      let withdrawActions = await this.fetchWithdraws();
      let depositActions = await this.fetchDeposits();


      this.$patch((state) => {
        state.tables.usertools = usertools;
        state.tables.usersbyrate = usersbyrate;
        state.tables.usersbystake = usersbystake;
        state.tables.stat = stat;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
        state.walletBalances = walletBalances;
        state.withdrawActions = withdrawActions;
        state.depositActions = depositActions;
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

      setTimeout(async () => {
        this.depositActions = await this.fetchDeposits();
      }, 5000);
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

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
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

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
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


    async openBox(assetIds) {
      await this.sendAction(this.getSmartActions.openbox(assetIds));
      await this.sleep();

      async function check(game) {
        let returnedAssets = await game.assetIdsToAtomicAssets(assetIds[0]);
        let checkAsset = returnedAssets[0];
        return Boolean(checkAsset && checkAsset["owner"]);
      }

      let checkChange = await check(this);
      while (checkChange) {
        await this.sleep();
        checkChange = await check(this);
      }

      let newWalletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );

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

    async buy(id) {
      await this.sendAction(this.getSmartActions.buy(id));
      await this.sleep();

      let users = await this.getSmartTables.users();

      let newWalletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      
      let addedAssets = newWalletAssets.filter((itemRow) => {
        return !this.walletAssets.some(
          (oldItemRow) => itemRow["asset_id"] == oldItemRow["asset_id"]
        );
      });


      this.$patch((state) => {
        state.tables.users = users;

        state.walletAssets = newWalletAssets;
      });

      return addedAssets;
    },

    async updateGlobalStat() {
      this.tables.stat = (await this.getSmartTables.stat())[0];
    },

    //calcs

    
  },
});