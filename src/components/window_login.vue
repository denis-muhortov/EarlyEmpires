<script>

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
      <div class="anchor">
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

