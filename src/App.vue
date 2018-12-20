<template>
  <div id="app">

    <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
          <router-link  to="./" class="navbar-brand col-sm-3 col-md-2 mr-0">{{ $t("app_variamos") }}</router-link>
          <input class="form-control form-control-dark w-100" type="text" v-bind:placeholder="$t('app_search')" v-bind:aria-label="$t('app_search')">
          <ul class="navbar-nav px-3">
            <li class="nav-item text-nowrap">
              <a class="nav-link">Sign out</a>
            </li>
          </ul>
        </nav>

        <div class="container-fluid">
            <div class="row">
              <nav class="col-md-2 d-none d-md-block bg-light sidebar">
                <div class="sidebar-sticky">
                  <ul class="nav flex-column">
                    <li class="nav-item">
                      <router-link class="nav-link" to="/">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        {{ $t("app_menu_home") }}
                      </router-link>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-layers"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                        {{ $t("app_menu_models") }}
                      </a>
                        <ul class="nav flex-column submenu">
                          <li class="nav-item">
                            <router-link class="nav-link" to="/models/feature">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            {{ $t("app_menu_feature") }}
                            </router-link>
                          </li>
                          <li class="nav-item">
                            <router-link class="nav-link" to="/models/component">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            {{ $t("app_menu_component") }}
                            </router-link>
                          </li>
                          <li class="nav-item">
                            <router-link class="nav-link" to="/models/binding_feature_component">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            {{ $t("app_menu_binding_f_c") }}
                            </router-link>
                          </li>
                        </ul>

                    </li>
                    <li class="nav-item">
                      <router-link class="nav-link" to="/about">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        {{ $t("app_menu_about") }}
                      </router-link>
                    </li>
                    <li class="nav-item">
                      <router-link class="nav-link" to="/reports">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        {{ $t("app_menu_reports") }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </nav>

              <main role="main" class="top-main col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">

                <div class="container">
                  <div id="mainview">
                    <router-view></router-view>
                  </div>
                </div>

                <!-- begin main modal -->
                <div>                 
                      <div class="modal" id="main_modal">
                      <div class="modal-wrapper">
                        <div class="modal-container">
                          <content select=".modal-header">
                            <div id="main_modal_header" class="modal-header">
                              <h3>
                                
                              </h3>
                            </div>
                          </content>
                          <div id="main_modal_body" class="modal-body">
                            
                          </div>
                          <div class="modal-footer">
                            <div id="main_modal_footer"></div>
                            <div><button @click="hide_modal()">Close</button></div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
                <!-- end main modal -->

              </main>
          </div>

        </div>
  </div>
</template>

<script>
export default {
  data: function(){
    return {
    }
  },
  methods: {
    hide_modal(){
      document.getElementById('main_modal').style.display="none";
    }
  }
}
</script>

<style>
@media (min-width: 768px){
  .top-main{
      -ms-flex: 0 0 83%;
      flex: 0 0 83%;
      max-width: 83%;
  }
}

.dropdown-item.active, .dropdown-item:active {
   background-color: gainsboro !important;
}

.submenu{
  padding-left: 25px !important;
}

#mainview {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 7px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: none;
  transition: opacity .3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  background: #fff;
  width: 650px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all .3s ease;
  margin: 0 auto;
  padding: 20px 30px;
}
.modal-footer {
  margin-top: 15px;
}
.modal-enter, .modal-leave {
  opacity: 0;
}
.modal-enter .modal-container, .modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
