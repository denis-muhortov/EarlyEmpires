import { defineStore } from "pinia";

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
    sendAction: Promise,
    userName: String,
    userAuth: String,
    historyEndpoint: String,

    tables: {
      //configs

      gamecfg: {},

      crafts: [],
      packs: [],
      captains: [],
      stations: [],
      spaceships: [],
      boosts: [],
      earlies: [],

      // stats

      players: [],
      usercrews: [],
      usercaptains: [],
      userstationsbyowner: [],
      userstationsbyuser: [],
      referralsbyreferral: [],
      referralsbyreferrer: [],
      stationlogs: [],

      // actions

      missions: [],
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
    player: (state) => state.tables.players[0],
    playerCrews: (state) => state.tables.usercrews,
    playerCaptainsInventory: (state) => state.tables.usercaptains,
    playerOwnedStation: (state) => {
      let station = state.tables.userstationsbyowner[0];
      if (!station) return;
      let stationAsset = state.playerStations.find(
        (st) => +st["asset_id"] == +station["station_id"]
      );
      if (!stationAsset) return;

      stationAsset.station = station;
      return stationAsset;
    },
    playerUsedStation: (state) => {
      let station = state.tables.userstationsbyuser[0];
      if (!station) return;
      let stationAsset = state.playerStations.find(
        (st) => +st["asset_id"] == +station["station_id"]
      );
      if (!stationAsset) return;

      stationAsset.station = station;
      return stationAsset;
    }, //TODO add config
    playerRefStat: (state) => state.tables.referralsbyreferral[0],
    playerReferrals: (state) => state.tables.referralsbyreferrer,
    playerStationLogs: (state) => state.tables.stationlogs,
    playerMissions: (state) => state.tables.missions,

    craftsList: (state) => state.tables.crafts,
    packsList: (state) => state.tables.packs,
    captainsList: (state) => state.tables.captains,
    stationsList: (state) => state.tables.stations,
    spaceshipsList: (state) => state.tables.spaceships,
    boostsList: (state) => state.tables.boosts,
    earliesList: (state) => state.tables.earlies,

    playerPacks: (state) =>
      state.getAssetsByTemplateConfigTable(state.packsList, [
        ...state.inventoryAssets,
        ...state.walletAssets,
      ]),
    playerCaptains: (state) =>
      state.getAssetsByTemplateConfigTable(state.captainsList, [
        ...state.inventoryAssets,
        ...state.walletAssets,
      ]),
    playerStations: (state) =>
      state.getAssetsByTemplateConfigTable(state.stationsList, [
        ...state.inventoryAssets,
        ...state.walletAssets,
      ]),
    playerSpaceships: (state) =>
      state.getAssetsByTemplateConfigTable(state.spaceshipsList, [
        ...state.inventoryAssets,
        ...state.walletAssets,
      ]),
    playerBoosts: (state) =>
      state.getAssetsByTemplateConfigTable(state.boostsList, [
        ...state.inventoryAssets,
        ...state.walletAssets,
      ]),
    playerEarlies: (state) =>
      state.getAssetsByTemplateConfigTable(state.earliesList, [
        ...state.inventoryAssets,
        ...state.walletAssets,
      ]),

    gameAssetsIds: (state) => {
      let gameAssetIds = [];

      let crews = state.playerCrews;

      for (let crew of crews) {
        gameAssetIds.push(crew["captain"], crew["spaceship"]);
      }

      let captains = state.playerCaptainsInventory;

      for (let captain of captains) {
        gameAssetIds.push(captain["asset_id"]);
      }

      let player = state.player;

      if (player) {
        gameAssetIds.push(
          player["early"],
          player["userstation"],
          player["station"]
        );
      }

      gameAssetIds = gameAssetIds.filter((id) => id != 0);

      return gameAssetIds;
    },
    gameAssetsIdsFromState:(oldstate) =>{return ({crews = oldstate.tables.usercrews, captains = oldstate.tables.usercaptains, player = oldstate.tables.players[0]}) => {
      let gameAssetIds = [];

      for (let crew of crews) {
        gameAssetIds.push(crew["captain"], crew["spaceship"]);
      }


      for (let captain of captains) {
        gameAssetIds.push(captain["asset_id"]);
      }

      if (player) {
        gameAssetIds.push(
          player["early"],
          player["userstation"],
          player["station"]
        );
      }

      gameAssetIds = gameAssetIds.filter((id) => id != 0);

      return gameAssetIds;
    }},

    balanceLCA: (state) => {
      if (!state.player) return 0;
      return state.findBalance(state.player.balances, "LCA");
    },
    balanceLCB: (state) => {
      if (!state.player) return 0;
      return state.findBalance(state.player.balances, "LCB");
    },
    balanceLCR: (state) => {
      if (!state.player) return 0;
      return state.findBalance(state.player.balances, "LCR");
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

    walletBalanceLCA: (state) => {
      return state.findBalance(state.walletBalances, "LCA");
    },
    walletBalanceLCB: (state) => {
      return state.findBalance(state.walletBalances, "LCB");
    },
    walletBalanceLCR: (state) => {
      return state.findBalance(state.walletBalances, "LCR");
    },

    getCurrentSeconds() {
      return () => {return Math.floor(Date.now() / 1000)};
    },
    ISOToSeconds() {
      return (datestring) => {return Math.floor(new Date(datestring + "Z").getTime() / 1000)};
    },

    getSmartTables: function (state) {
      return {
        //tables configs

        async gamecfg() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "game",
            1
          );
          return rows;
        },

        async crafts() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "crafts",
            -1
          );
          return rows;
        },

        async packs() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "packs",
            -1
          );
          return rows;
        },
        async captains() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "captains",
            -1
          );
          return rows;
        },
        async stations() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "stations",
            -1
          );
          return rows;
        },
        async spaceships() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "spaceships",
            -1
          );
          return rows;
        },
        async boosts() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "boosts",
            -1
          );
          return rows;
        },
        async earlies() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "earlies",
            -1
          );
          return rows;
        },

        //tables actions

        async missions(wallet = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "missions",
            -1,
            wallet,
            wallet,
            2,
            "name"
          );
          return rows;
        },

        //tables stats

        async players(player = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "players",
            1,
            player,
            player
          );
          return rows;
        },
        async playersbystation(station_id) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "players",
            -1,
            station_id,
            station_id,
            2
          );
          return rows;
        },

        async usercrews(user = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "usercrews",
            -1,
            user,
            user,
            2,
            "name"
          );
          return rows;
        },
        async userstationsbyowner(user = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "userstations",
            -1,
            user,
            user,
            2,
            "name"
          );
          return rows;
        },
        async userstationsbyid(id) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "userstations",
            1,
            id,
            id
          );
          return rows;
        },
        async userstationsall() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "userstations",
            -1
          );
          return rows;
        },
        async usercaptains(user = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            user,
            "usercaptains",
            -1
          );
          return rows;
        },
        async stationlogs(station_id) {
          let rows = await state.getTableRows(
            state.smartContract,
            station_id,
            "stationlogs",
            -1
          );
          return rows;
        },

        async referralsbyreferral(user = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "referrals",
            1,
            user,
            user
          );
          return rows;
        },
        async referralsbyreferrer(user = state.userName) {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "referrals",
            -1,
            user,
            user,
            2,
            "name"
          );
          return rows;
        },

        async alluserstations() {
          let rows = await state.getTableRows(
            state.smartContract,
            state.smartContract,
            "userstations",
            -1
          );
          return rows;
        },
      };
    },

    getSmartActions: function (state) {
      return {
        addstation(asset_ids, title) {
          let actions = [
            {
              account: "atomicassets",
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                asset_ids: asset_ids,
                memo: `add station ${title}`,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        addcaptain(asset_ids) {
          let actions = [
            {
              account: "atomicassets",
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                asset_ids: asset_ids,
                memo: "add captain",
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        addspaceship(asset_ids, crew_id) {
          let actions = [
            {
              account: "atomicassets",
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                asset_ids: asset_ids,
                memo: `add spaceship ${crew_id}`,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        addearly(asset_ids) {
          let actions = [
            {
              account: "atomicassets",
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                asset_ids: asset_ids,
                memo: "add early",
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        openpack(asset_ids) {
          let actions = [
            {
              account: "atomicassets",
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                asset_ids: asset_ids,
                memo: "open pack",
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        useboost(asset_ids, crew_id) {
          let actions = [
            {
              account: "atomicassets",
              name: "transfer",
              data: {
                from: state.userName,
                to: state.smartContract,
                asset_ids: asset_ids,
                memo: `use boost ${crew_id}`,
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

        mission(crew_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "mission",
              data: {
                wallet: state.userName,
                crew_id: crew_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        claim(crew_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "claim",
              data: {
                wallet: state.userName,
                crew_id: crew_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        createcrew(title) {
          let actions = [
            {
              account: state.smartContract,
              name: "createcrew",
              data: {
                wallet: state.userName,
                title: title,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        deletecrew(crew_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "deletecrew",
              data: {
                wallet: state.userName,
                crew_id: crew_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        removeship(crew_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "removeship",
              data: {
                wallet: state.userName,
                crew_id: crew_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        removecapinv(crew_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "removecapinv",
              data: {
                wallet: state.userName,
                crew_id: crew_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        removecap(captain_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "removecap",
              data: {
                wallet: state.userName,
                captain_id: captain_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        addcapinv(crew_id, captain_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "addcapinv",
              data: {
                wallet: state.userName,
                crew_id: crew_id,
                captain_id: captain_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        getfuel(quantity) {
          let actions = [
            {
              account: state.smartContract,
              name: "getfuel",
              data: {
                wallet: state.userName,
                quantity: quantity,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        getstamina(quantity, crew_id, captain_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "getstamina",
              data: {
                wallet: state.userName,
                quantity: quantity,
                crew_id: crew_id,
                captain_id: captain_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        selectstat(new_station_id) {
          let actions = [
            {
              account: state.smartContract,
              name: "selectstat",
              data: {
                wallet: state.userName,
                new_station_id: new_station_id,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        removestat() {
          let actions = [
            {
              account: state.smartContract,
              name: "removestat",
              data: {
                wallet: state.userName,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        setstatdesc(description) {
          let actions = [
            {
              account: state.smartContract,
              name: "setstatdesc",
              data: {
                wallet: state.userName,
                description: description,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        setstatfee(fee) {
          let actions = [
            {
              account: state.smartContract,
              name: "setstatfee",
              data: {
                wallet: state.userName,
                fee: fee,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        claimstat() {
          let actions = [
            {
              account: state.smartContract,
              name: "claimstat",
              data: {
                wallet: state.userName,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
        kickstat(user) {
          let actions = [
            {
              account: state.smartContract,
              name: "kickstat",
              data: {
                wallet: state.userName,
                user: user,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        removeearly() {
          let actions = [
            {
              account: state.smartContract,
              name: "removeearly",
              data: {
                wallet: state.userName,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        craft(craft_id, asset_ids = []) {
          let actions = [
            {
              account: state.smartContract,
              name: "craft",
              data: {
                wallet: state.userName,
                craft_id: craft_id,
              },
              authorization: state.userAuth,
            },
          ];
          if (asset_ids.length > 0) {
            let transferactions = [
              {
                account: "atomicassets",
                name: "transfer",
                data: {
                  from: state.userName,
                  to: state.smartContract,
                  asset_ids: asset_ids,
                  memo: "craft",
                },
                authorization: state.userAuth,
              },
            ];

            actions = [...transferactions, ...actions];
          }
          return actions;
        },

        upgradestat(improve) {
          let actions = [
            {
              account: state.smartContract,
              name: "upgradestat",
              data: {
                wallet: state.userName,
                improve: improve,
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },

        reg: (referrer) => {
          let actions = [
            {
              account: state.smartContract,
              name: "reg",
              data: {
                wallet: state.userName,
                referrer: referrer ? referrer : "",
              },
              authorization: state.userAuth,
            },
          ];
          return actions;
        },
      };
    },
  },
  actions: {
    init({
      waxjs,
      sendAction,
      userName,
      userAuth,
      smartContract,
      tokenSmart,
      collectionName,
      atomicExplorerApi,
      historyEndpoint,
    }) {
      this.smartContract = smartContract;
      this.tokenSmart = tokenSmart;
      this.collectionName = collectionName;
      this.atomicExplorerApi = atomicExplorerApi;
      this.waxjs = waxjs;
      this.sendAction = sendAction;
      this.userName = userName;
      this.userAuth = userAuth;
      this.historyEndpoint = historyEndpoint;
    },

    async restoreFromStorage({
      waxjs,
      sendAction,
      atomicExplorerApi,
      historyEndpoint,
      storageData,
    }) {
      let initObj = storageData.init;
      let confObj = storageData.conf;
      let statObj = storageData.stat;

      this.init({
        waxjs: waxjs,
        sendAction: sendAction,
        userName: initObj.userName,
        userAuth: initObj.userAuth,
        smartContract: initObj.smartContract,
        tokenSmart: initObj.tokenSmart,
        collectionName: initObj.collectionName,
        atomicExplorerApi: atomicExplorerApi,
        historyEndpoint: historyEndpoint,
      });

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
        this.tables.players = statObj.tables.players;
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
            players: this.tables.players,
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
      let crafts = await this.getSmartTables.crafts();
      let packs = await this.getSmartTables.packs();
      let captains = await this.getSmartTables.captains();
      let stations = await this.getSmartTables.stations();
      let spaceships = await this.getSmartTables.spaceships();
      let boosts = await this.getSmartTables.boosts();
      let earlies = await this.getSmartTables.earlies();
      let collectionTemplates = await this.atomicExplorerApi.getTemplates(
        {
          collection_name: this.collectionName,
        },
        1,
        1000
      );

      this.$patch((state) => {
        state.tables.gamecfg = gamecfg;
        state.tables.crafts = crafts;
        state.tables.packs = packs;
        state.tables.captains = captains;
        state.tables.stations = stations;
        state.tables.spaceships = spaceships;
        state.tables.boosts = boosts;
        state.tables.earlies = earlies;
        state.collectionTemplates = collectionTemplates;
      });
    },
    async loadstats() {
      this.tables.players = await this.getSmartTables.players();
      if (this.tables.players.length < 1) {
        console.log("Player is not registered");
        throw { message: "Player is not registered", code: 1 };
      }







      
      let usercrews = await this.getSmartTables.usercrews();
      let usercaptains = await this.getSmartTables.usercaptains();
      let userstationsbyowner =
                             await this.getSmartTables.userstationsbyowner();
      let userstationsbyuser =
                await this.getSmartTables.userstationsbyid(+this.player["station"]);

      let referralsbyreferral =
                await this.getSmartTables.referralsbyreferral();
      let referralsbyreferrer =
                                             await this.getSmartTables.referralsbyreferrer();

                                             let stationlogs = [];
      if (userstationsbyowner[0]) {
        stationlogs = await this.getSmartTables.stationlogs(
          +userstationsbyowner[0]["station_id"]
        );
      }

      let missions = await this.getSmartTables.missions();



      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({crews: usercrews, captains: usercaptains})
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
        state.tables.usercrews = usercrews;
        state.tables.usercaptains = usercaptains;
        state.tables.userstationsbyowner = userstationsbyowner;
        state.tables.userstationsbyuser = userstationsbyuser;
        state.tables.userstationsbyuser = userstationsbyuser;
        state.tables.referralsbyreferral = referralsbyreferral;
        state.tables.referralsbyreferrer = referralsbyreferrer;
        state.tables.stationlogs = stationlogs;
        state.tables.missions = missions;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
        state.walletBalances = walletBalances;
        state.withdrawActions = withdrawActions;
        state.depositActions = depositActions;
      });




    },

    async getTableRows(
      contract,
      scope,
      table,
      limit = 100,
      lowerBound = "",
      upperBound = "",
      indexPosition = 1,
      keyType = `i64`,
      reverse = false
    ) {
      await this.sleep(100);
      if (limit < 0) {
        let resultRows = [];

        let loopLowerBound = lowerBound;

        while (true) {
          let res = await this.waxjs.rpc.get_table_rows({
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
        let res = await this.waxjs.rpc.get_table_rows({
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
    },

    async sleep(ms = 1000) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async fetchWalletBalances() {
      let balance = [
        ...(await this.waxjs.rpc.get_currency_balance(
          this.tokenSmart,
          this.userName
        )),
      ];
      return balance;
    },
    async assetIdsToAtomicAssets(assetIds) {
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
    },

    async fetchWithdraws() {
      let getActionLink = new URL(
        "/v2/history/get_actions",
        this.historyEndpoint
      );

      let params = new URLSearchParams({
        limit: 50,
        account: this.userName,
        filter: `${this.smartContract}:withdraw`,
        simple: true,
      });

      getActionLink.search = params;

      let response = await fetch(getActionLink);

      let data = await response.json();

      let actions = data["simple_actions"];

      return actions;
    },
    async fetchDeposits() {
      let getActionLink = new URL(
        "/v2/history/get_actions",
        this.historyEndpoint
      );

      let params = new URLSearchParams({
        limit: 50,
        account: this.userName,
        filter: `${this.tokenSmart}:transfer`,
        simple: true,
      });

      getActionLink.search = params;

      let response = await fetch(getActionLink);

      let data = await response.json();

      let actions = data["simple_actions"];

      actions = actions.filter((act) => act.data.to == this.smartContract);

      return actions;
    },

    //game actions
    async registerPlayer(referrer) {
      await this.sendAction(this.getSmartActions.reg(referrer));
    },

    async deposit(quantity) {
      await this.sendAction(this.getSmartActions.deposit(quantity));
      await this.sleep();



      let players = await this.getSmartTables.players();
      let walletBalances = await this.fetchWalletBalances();

      this.$patch((state) => {
        state.tables.players = players;

        state.walletBalances = walletBalances;
      });

      setTimeout(async () => {
        this.depositActions = await this.fetchDeposits();
      }, 5000);
    },

    async withdraw(quantity) {
      await this.sendAction(this.getSmartActions.withdraw(quantity));
      await this.sleep();

      let players = await this.getSmartTables.players();
      let walletBalances = await this.fetchWalletBalances();

      this.$patch((state) => {
        state.tables.players = players;

        state.walletBalances = walletBalances;
      });

      setTimeout(async () => {
        this.withdrawActions = await this.fetchWithdraws();
      }, 5000);
    },

    async addStation(assetIds, title) {
      await this.sendAction(this.getSmartActions.addstation(assetIds, title));
      await this.sleep();





      let players = await this.getSmartTables.players();
      let userstationsbyowner =
        await this.getSmartTables.userstationsbyowner();

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({player:players[0]})
      );

      this.$patch((state) => {
        state.tables.players = players;
        state.tables.userstationsbyowner = userstationsbyowner;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },
    async addEarly(assetIds) {
      await this.sendAction(this.getSmartActions.addearly(assetIds));
      await this.sleep();

      let players = await this.getSmartTables.players();

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({player:players[0]})
      );

      this.$patch((state) => {
        state.tables.players = players;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },
    async addCaptain(assetIds) {
      await this.sendAction(this.getSmartActions.addcaptain(assetIds));
      await this.sleep();

      //this.tables.usercrews           = await this.getSmartTables.usercrews();
      let usercaptains = await this.getSmartTables.usercaptains();


      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({captains: usercaptains})
      );

      this.$patch((state) => {
        state.tables.usercaptains = usercaptains;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },
    async addSpaceship(assetIds, crewId) {
      await this.sendAction(
        this.getSmartActions.addspaceship(assetIds, crewId)
      );
      await this.sleep();

      let usercrews = await this.getSmartTables.usercrews();
      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({crews: usercrews})
      );

      this.$patch((state) => {
        state.tables.usercrews = usercrews;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });

    },
    async openPack(assetIds) {
      await this.sendAction(this.getSmartActions.openpack(assetIds));
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
    async useBoost(assetIds, crewId) {
      await this.sendAction(this.getSmartActions.useboost(assetIds, crewId));
      await this.sleep();

      let usercrews = await this.getSmartTables.usercrews();
      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({crews: usercrews})
      );

      this.$patch((state) => {
        state.tables.usercrews = usercrews;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },

    async startMission(crewId) {
      await this.sendAction(this.getSmartActions.mission(crewId));
      await this.sleep();

      this.tables.missions = await this.getSmartTables.missions();
      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();
    },
    async endMission(crewId) {
      await this.sendAction(this.getSmartActions.claim(crewId));
      await this.sleep();

      let players = await this.getSmartTables.players();
      let missions = await this.getSmartTables.missions();
      let usercrews = await this.getSmartTables.usercrews();


      this.$patch((state) => {
        state.tables.players = players;
        state.tables.missions = missions;
        state.tables.usercrews = usercrews;
      });





      await this.sleep(5000);

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
      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();
    },

    async startMissionsAll() {
      let actions = [];

      for (let crew of this.playerCrews) {
        let mission = this.playerMissions.find(
          (m) => m.crew_id == crew.crew_id
        );
        if (
          !mission &&
          crew.captain != 0 &&
          crew.spaceship != 0 &&
          crew.stamina != 0
        ) {
          actions.push(...this.getSmartActions.mission(crew.crew_id));
        }
      }

      if (actions.length == 0) throw { message: "No crews for mining" };

      await this.sendAction(actions);
      await this.sleep();

      this.tables.missions = await this.getSmartTables.missions();
      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();
    },
    async endMissionsAll() {
      let actions = [];

      for (let mission of this.playerMissions) {
        actions.push(...this.getSmartActions.claim(mission.crew_id));
      }

      if (actions.length == 0) throw { message: "No crews for claim" };

      await this.sendAction(actions);

      await this.sleep();

      let players = await this.getSmartTables.players();
      let missions = await this.getSmartTables.missions();
      let usercrews = await this.getSmartTables.usercrews();


      this.$patch((state) => {
        state.tables.players = players;
        state.tables.missions = missions;
        state.tables.usercrews = usercrews;
      });

      await this.sleep(5000);

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
      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();
    },

    async createCrew(title) {
      await this.sendAction(this.getSmartActions.createcrew(title));
      await this.sleep();


      let players = await this.getSmartTables.players();
      let usercrews = await this.getSmartTables.usercrews();

      this.$patch((state) => {
        state.tables.players = players;
        state.tables.usercrews = usercrews;
      });

      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();
    },
    async deleteCrew(crewId) {
      await this.sendAction(this.getSmartActions.deletecrew(crewId));
      await this.sleep();

      let players = await this.getSmartTables.players();
      let usercrews = await this.getSmartTables.usercrews();

      this.$patch((state) => {
        state.tables.players = players;
        state.tables.usercrews = usercrews;
      });

      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();
    },
    async deleteCrewAutoUnstake(crewId) {
      let actions = [];

      let crew = this.playerCrews.find(c => c.crew_id == crewId);
      let mission = this.playerMissions.find(m => m.crew_id == crewId);

      if(mission) throw {message: "Your mission still going"};

      
      if(crew.captain != 0){
        actions = [...actions, ...this.getSmartActions.removecapinv(crewId)]
      }
      if(crew.spaceship != 0){
        actions = [...actions, ...this.getSmartActions.removeship(crewId)]
      }

      actions = [...actions, ...this.getSmartActions.deletecrew(crewId)]
      await this.sendAction(actions);
      await this.sleep();


      let players = await this.getSmartTables.players();
      let usercrews = await this.getSmartTables.usercrews();

      let usercaptains = await this.getSmartTables.usercaptains();

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({crews: usercrews, captains: usercaptains, player: players[0]})
      );


      this.$patch((state) => {
        state.tables.players = players;
        state.tables.usercrews = usercrews;
        state.tables.usercaptains = usercaptains;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });

      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();
    },
    async removeSpaceship(crewId) {
      await this.sendAction(this.getSmartActions.removeship(crewId));
      await this.sleep();

      //this.tables.players           = await this.getSmartTables.players();
      let usercrews = await this.getSmartTables.usercrews();
      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({crews: usercrews})
      );

      this.$patch((state) => {
        state.tables.usercrews = usercrews;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },
    async removeCaptainToInventory(crewId) {
      await this.sendAction(this.getSmartActions.removecapinv(crewId));
      await this.sleep();


      let usercaptains = await this.getSmartTables.usercaptains();
      let usercrews = await this.getSmartTables.usercrews();

      this.$patch((state) => {
        state.tables.usercaptains = usercaptains;
        state.tables.usercrews = usercrews;
      });
    },
    async addCaptainFromInventory(crewId, captainId) {
      await this.sendAction(this.getSmartActions.addcapinv(crewId, captainId));
      await this.sleep();

      let usercaptains = await this.getSmartTables.usercaptains();
      let usercrews = await this.getSmartTables.usercrews();

      this.$patch((state) => {
        state.tables.usercaptains = usercaptains;
        state.tables.usercrews = usercrews;
      });
    },
    async removeCaptainFromInventory(captainId) {
      await this.sendAction(this.getSmartActions.removecap(captainId));
      await this.sleep();

      //this.tables.players           = await this.getSmartTables.players();
      let usercaptains = await this.getSmartTables.usercaptains();
      //this.tables.usercaptains           = await this.getSmartTables.usercaptains();

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({captains: usercaptains})
      );

      this.$patch((state) => {
        state.tables.usercaptains = usercaptains;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },

    async getFuel(quantity) {
      await this.sendAction(this.getSmartActions.getfuel(quantity));
      await this.sleep();

      this.tables.players = await this.getSmartTables.players();
    },
    async getStamina(quantity, crewId, captainId) {
      await this.sendAction(
        this.getSmartActions.getstamina(quantity, crewId, captainId)
      );
      await this.sleep();

      let players = await this.getSmartTables.players();
      let usercaptains = await this.getSmartTables.usercaptains();
      let usercrews = await this.getSmartTables.usercrews();

      this.$patch((state) => {
        state.tables.players = players;
        state.tables.usercaptains = usercaptains;
        state.tables.usercrews = usercrews;
      });

    },
    async getStaminaAllCrews() {
      let actions = [];

      for (let crew of this.playerCrews) {
        if (crew.captain != 0) {
          let captain = this.playerCaptains.find((a) => {
            return +crew.captain == +a["asset_id"];
          });

          let needQuantity = captain.config.stamina - crew.stamina;

          if (needQuantity > 0) {
            actions.push(
              ...this.getSmartActions.getstamina(needQuantity, crew.crew_id, 0)
            );
          }
        }
      }

      if (actions.length == 0) throw { message: "No captains for heal" };
      await this.sendAction(actions);
      await this.sleep();

      let players = await this.getSmartTables.players();
      let usercaptains = await this.getSmartTables.usercaptains();
      let usercrews = await this.getSmartTables.usercrews();

      this.$patch((state) => {
        state.tables.players = players;
        state.tables.usercaptains = usercaptains;
        state.tables.usercrews = usercrews;
      });
    },

    async selectStation(newStationId) {
      await this.sendAction(this.getSmartActions.selectstat(newStationId));
      await this.sleep();

      let players = await this.getSmartTables.players();


      let userstationsbyowner =
        await this.getSmartTables.userstationsbyowner();
      let userstationsbyuser =
        await this.getSmartTables.userstationsbyid(newStationId);

      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({player:players[0]})
      );

      this.$patch((state) => {
        state.tables.players = players;
        state.tables.userstationsbyowner = userstationsbyowner;
        state.tables.userstationsbyuser = userstationsbyuser;

        state.inventoryAssets = inventoryAssets;
      });
    },
    async removeStation() {
      await this.sendAction(this.getSmartActions.removestat());
      await this.sleep();

      let players = await this.getSmartTables.players();
      let userstationsbyowner =
        await this.getSmartTables.userstationsbyowner();

      let userstationsbyuser = [];
      if (players[0] && players[0].station != 0) {
        userstationsbyuser =
          await this.getSmartTables.userstationsbyid(players[0].station);
      }


      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({player: players[0]})
      );

      this.$patch((state) => {
        state.tables.players = players;
        state.tables.userstationsbyowner = userstationsbyowner;
        state.tables.userstationsbyuser = userstationsbyuser;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },
    async setStationDescription(description) {
      await this.sendAction(this.getSmartActions.setstatdesc(description));
      await this.sleep();

      this.tables.userstationsbyowner =
        await this.getSmartTables.userstationsbyowner();
      //this.tables.usercrews           = await this.getSmartTables.usercrews();
    },
    async setStationFee(fee) {
      await this.sendAction(this.getSmartActions.setstatfee(fee));
      await this.sleep();

      this.tables.userstationsbyowner =
        await this.getSmartTables.userstationsbyowner();
      //this.tables.usercrews           = await this.getSmartTables.usercrews();
    },
    async claimStationFee() {
      await this.sendAction(this.getSmartActions.claimstat());
      await this.sleep();

      let userstationsbyowner =
        await this.getSmartTables.userstationsbyowner();
      let players = await this.getSmartTables.players();

      this.$patch((state) => {
        state.tables.players = players;
        state.tables.userstationsbyowner = userstationsbyowner;
      });


    },
    async kickStationUser(user) {
      await this.sendAction(this.getSmartActions.kickstat(user));
      await this.sleep();

      let userstationsbyowner =
        await this.getSmartTables.userstationsbyowner();
      let players = await this.getSmartTables.players();

      this.$patch((state) => {
        state.tables.players = players;
        state.tables.userstationsbyowner = userstationsbyowner;
      });
    },

    async removeEarly() {
      await this.sendAction(this.getSmartActions.removeearly());
      await this.sleep();

      let players = await this.getSmartTables.players();

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({player: players[0]})
      );

      this.$patch((state) => {
        state.tables.players = players;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },

    async upgradeStation(levels) {
      await this.sendAction(this.getSmartActions.upgradestat(levels));
      await this.sleep();

      let userstationsbyowner =
        await this.getSmartTables.userstationsbyowner();
      let players = await this.getSmartTables.players();

      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIds
      );

      this.$patch((state) => {
        state.tables.players = players;
        state.tables.userstationsbyowner = userstationsbyowner;

        state.inventoryAssets = inventoryAssets;
      });


    },
    async craft(id, assetIds) {
      await this.sendAction(this.getSmartActions.craft(id, assetIds));
      await this.sleep();

      this.tables.players = await this.getSmartTables.players();

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

    async addCaptainTransit(assetIds, crewId) {
      await this.sendAction([
        ...this.getSmartActions.addcaptain(assetIds),
        ...this.getSmartActions.addcapinv(crewId, assetIds[0]),
      ]);
      await this.sleep();

      //this.tables.players           = await this.getSmartTables.players();
      let usercrews = await this.getSmartTables.usercrews();
      let usercaptains = await this.getSmartTables.usercaptains();

      let walletAssets = await this.atomicExplorerApi.getAssets(
        {
          owner: this.userName,
          collection_name: this.collectionName,
        },
        1,
        1000
      );
      let inventoryAssets = await this.assetIdsToAtomicAssets(
        this.gameAssetsIdsFromState({crews: usercrews, captains:usercaptains})
      );

      this.$patch((state) => {
        state.tables.usercrews = usercrews;
        state.tables.usercaptains = usercaptains;

        state.inventoryAssets = inventoryAssets;
        state.walletAssets = walletAssets;
      });
    },

    //calcs

    getAssetsByTemplateConfigTable(configTable, inventoryAssets) {
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
    },

    getCrewsWithMissions(crewTable, missionsTable) {
      let result = [];

      for (let item of crewTable) {
        let resultRow = Object.assign({}, item);
        resultRow.mission = missionsTable.find((mission) => {
          return +resultRow["crew_id"] == +mission["crew_id"];
        });
        result.push(resultRow);
      }

      return result;
    },

    calcMission(crew) {
      let mission = {
        crew_id: crew["crew_id"],
        wallet: crew["wallet"],
        start_time: new Date(this.getCurrentSeconds() * 1000).toISOString(),
        station_fee: 0,
        max: 0,
        tick_income: "0 ",
      };

      if (!this.playerUsedStation) return mission;

      mission.station_fee = this.playerUsedStation.station["station_fee"];

      let captain = this.playerCaptains.find(
        (a) => +a["asset_id"] == +crew["captain"]
      );
      if (!captain) return mission;

      let baseIncome = +captain.config["tick_extraction"].split(" ")[0];

      let spaceship = this.playerSpaceships.find(
        (a) => +a["asset_id"] == +crew["spaceship"]
      );
      if (!spaceship) return mission;

      mission.max = +spaceship.config["capacity"] * 100000000;

      let incomeBoost = spaceship.config["bonus"];

      if (this.ISOToSeconds(crew["boost_end"]) > this.getCurrentSeconds()) {
        incomeBoost += crew["boost_val"];
      }

      if (this.playerRefStat) {
        incomeBoost += this.gameConfig["referal_boost"];
      }

      let fullBoost = 1 + incomeBoost / 100000000.0;

      let resultTickIncome = baseIncome * fullBoost;

      mission.tick_income = `${resultTickIncome} ${
        captain.config["tick_extraction"].split(" ")[1]
      }`;

      return mission;
    },
  },
});
