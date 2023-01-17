<script>
import { useGameStore } from '../stores/game.js'
import AnchorLink from 'anchor-link';
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport';

export default {
  name: "blockLogin",
  emits: ['login'],
  data() {
    const game = useGameStore();
    let apiEndpoints = [
      {title: "NeftyGuild", href: "https://wax-public-testnet.neftyblocks.com"},
      {title: "3DKRender", href: "https://testnet-wax.3dkrender.com"},
      {title: "pink.gg", href: "http://testnet.wax.pink.gg"},
    ];
    let atomicEndpoints = [
    {title: "3DKRender", href: "https://testatomic.3dkrender.com"},
    {title: "pink.gg", href: "https://test.wax.api.atomicassets.io"},
    {title: "WAXUSA", href: "https://test.wax.eosusa.io"},
    ];
    let historyEndpoints = [
    {title: "NeftyGuild", href: "https://wax-testnet-hyperion.neftyblocks.com"},
    {title: "3DKRender", href: "https://tapiwax.3dkrender.com"},
    {title: "CryptoLions🦁", href: "https://wax-testnet.cryptolions.io"},
    ];
    return {
      login: "Login",
      description:
        "Welcome to a play-to-earn game, created on the WAX blockchain.",
      chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12', // f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12 // 1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4
      apiEndpoints: apiEndpoints,
      atomicEndpoints: atomicEndpoints,
      historyEndpoints: historyEndpoints,
      selectedApiEndpoint: apiEndpoints[0],
      selectedAtomicEndpoint: atomicEndpoints[0],
      selectedHistoryEndpoint: historyEndpoints[0],
      game: game,
      menupoint: false,
    };
  },
  methods: {
    loginWax() {
      this.$toast.show(`Loading...`, {
          asyncFunction: async () => { await this.startGame('wax');},
          onSuccessMessage: (res) => { return `Success!` },
      });
      
    },
    loginAnchor() {
      this.$toast.show(`Loading...`, {
          asyncFunction: async () => { await this.startGame('anchor');},
          onSuccessMessage: (res) => { return `Success!` },
      });
    },
    async startGame(wallet) {



      //startWaiting();
      try {
        await this.game.login({
          walletType: wallet,
        });

        await this.game.loadconfigs();
        await this.game.loadstats();
        this.game.saveToStorage({ walletType: wallet })
        //this.game.$subscribe(()=>{this.game.saveToStorage({walletType: wallet})}, { detached: true });
        this.$emit('login');
      } catch (e) {
        console.warn(e);
        throw (e);
      } finally {
        //endWaiting();
      }
    },
    toastRestore(){
      this.$toast.show(`Restoring session...`, {
          asyncFunction: async () => { await this.restoreGame();},
          onSuccessMessage: (res) => { return `Success!` },
      });
    },
    async restoreGame() {

      //startWaiting();
      try {
        await this.game.restoreFromStorage();
        this.$emit('login');
      } catch (e) {
        //showError(e);
        console.warn(e);
        throw (e);
      } finally {
        //endWaiting();
      }
    },
  },
  mounted() {
    this.toastRestore();
  }
};





</script>


<template>
  <div class="MainContainer">
    <div class="ContainerLogo">
      <img src="../assets/login/logo.png" alt="logo"/>
    </div>
    <div class="ContainerLogin">
      <div class="TextBlock">
        To enter the game select a wallet
      </div>
      <div class="wax">
        <img src="../assets/login/wax.png" alt="wax"/>
      </div>
      <div class="anchor" @click="loginAnchor">
        <img src="../assets/login/anchor.png" alt="anchor">
      </div>

      <div class="FrameLeft">
        <img src="../assets/login/frame_left.png" alt="frame_left"/>
      </div>
      <div class="FrameRight">
        <img src="../assets/login/frame_right.png" alt="frame_right"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.MainContainer{
  width: 100%;
  height: 100%;
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.ContainerLogin{
  width: 700px;
  height: 460px;
  background: rgba(23, 27, 40, 0.5);
}
.TextBlock{
  height: 100px;
  font-size: 26px;
  color: var(--vt-c-white);
  font-family: 'TheAncient', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  justify-content: flex-start;
}
.wax{
  height: 100px;
  width: 400px;
  margin: 25px 0px 25px 0px;
  border: 1px solid #FF8F00;
  background: #171717;
  cursor: pointer;
}
.anchor{
  height: 100px;
  width: 400px;
  border: 1px solid #3650A2;
  cursor: pointer;
}
.FrameLeft{
  position: absolute;
  left: -50px;
}
.FrameRight{
  position: absolute;
  right: -50px;
}
@media (max-width: 1024px) {
  .ContainerLogo{
  height: 150px;
  width: 800px;
  }
  .ContainerLogo img{
  width: 90%;
  } 
  .ContainerLogin{
    width: 520px;
    height: 350px;
  }
  .anchor, .wax{
    height: 80px;
    width: 300px;
  }
  .anchor img{
    width: 90%;
  }
  .wax img{  
    width: 70%;
  }
  .FrameLeft img, .FrameRight img{
    height: 350px;
  }
  .FrameLeft{
    left: -40px;
  }
  .FrameRight{
    right: -40px;
  }
}
</style>

