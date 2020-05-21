<template>
    <Page>
        <ActionBar title="Permit Scan" android:flat="true">
            <ActionItem @tap="onLogout" 
                        ios.systemIcon="16" 
                        ios.position="right" 
                        text="Logout" 
                        android.position="popup">
            </ActionItem>
        </ActionBar>/>
        <TabView android:tabBackgroundColor="#53ba82" android:tabTextColor="#c4ffdf" android:selectedTabTextColor="#ffffff" androidSelectedTabHighlightColor="#ffffff">
            <TabViewItem title="Scanner">
                <GridLayout columns="*" rows="*">
                    <BarcodeScanner
                        row="1"
                        height="300"
                        formats="QR_CODE, EAN_13, UPC_A"
                        beepOnScan="true"
                        reportDuplicates="true"
                        preferFrontCamera="false"
                        v-if="isIOS">
                    </BarcodeScanner>

                    <Button row="2" class="btn btn-primary btn-rounded-sm" text="Perform scan" @tap="scan"></Button>
                </GridLayout>
            </TabViewItem>
            <TabViewItem title="History">
                <GridLayout columns="*" rows="*">
                    <PullToRefresh @refresh="refreshList">
                        <ScrollView height="100%">
            
                            <ListView for="scan in scans" @itemTap="loadScan">
                                <v-template>
                                    <FlexboxLayout flexDirection="column">
                                        <Label :text=" 'Permit: ' + scan.permit.permit_number" class="t-12" fontSize="18"/>
                                        <Label :text=" 'Date: ' + scan.permit.created_at" class="t-12" fontSize="18"/>
                                        <Label :text=" 'Status: ' + scan.valid" class="t-12" fontSize="18"/>
                                    </FlexboxLayout>
                                </v-template>
                            </ListView>
                        </ScrollView>
                    </PullToRefresh>
                </GridLayout>
            </TabViewItem>
        </TabView>
    </Page>
</template>

<script>
    import {isIOS} from "tns-core-modules/platform"
    import {BarcodeScanner} from "nativescript-barcodescanner"
    import {ListViewModule} from "tns-core-modules/ui/list-view"

    import ScannerStore from "../store/modules/scanner"
    import Login from "./Login";
    import ScanDetail from "./ScanDetail"

    var geolocation = require("nativescript-geolocation")
    geolocation.enableLocationRequest();
    
    export default {
         data() {
            return {
                isIOS,
                needLocation:true,
                locationFailure:false,
                location:null,
                loading: true,
                ScanDetail: ScanDetail,
            }
        },  

        computed: {
            scans() {
                return this.$store.state.scanner.scans;
            },
        },

         created() {
             
            this.fetchHistory();

            geolocation.enableLocationRequest(true)
            .then(() => {
                geolocation.isEnabled().then(isLocationEnabled => {
                    console.log('result is '+isLocationEnabled);
                    if(!isLocationEnabled) {
                        this.needLocation = false;
                        this.locationFailure = true;
                        // potentially do more then just end here...
                        return;
                    }

                    // MUST pass empty object!!
                    geolocation.getCurrentLocation({})
                    .then(result => {
                        console.log('location set');
                        this.needLocation = false;
                        this.location = result;
                    })
                    .catch(e => {
                        console.log('location error', e);
                    });
                });
            });
        },

        methods: {
            loadScan(args) {
                var scan = this.$store.getters.getScans[args.index];
                console.log(this.$store.getters.getScans);
                this.$navigateTo(ScanDetail, {
                    transition: {
                        name:'fade',
                        duration: 200
                    },
                    props: {
                        scan: scan
                    }
                })
            },

            onLogout() {
                this.$store.dispatch("clearUser").then(() => {
                    this.$navigateTo(Login, {
                    clearHistory: true
                    });
                });
            },
            scan() {
                var self = this;
                new BarcodeScanner().scan({
                    cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
                    cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
                    message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
                    preferFrontCamera: false,     // Android only, default false
                    showFlipCameraButton: false,   // default false
                    showTorchButton: true,        // iOS only, default false
                    torchOn: false,               // launch with the flashlight on (default false)
                    resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
                    beepOnScan: true,             // Play or Suppress beep on scan (default true)
                    openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
                })
                .then(function (result) {
                    const encodeGetParams = p => 
                            Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");

                    const params = {
                        permit_number: result.text,
                        latitude: self.location.latitude,
                        longitude: self.location.longitude
                    }  

                    fetch("https://permits.centrisign.co.ke/api/checkPermit?" + encodeGetParams(params), {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                            "Authorization": "Bearer " + self.$store.getters.token
                        },
                    }).then(function (response) {
                        if (!response.ok) {
                            alert({
                                title: "Permit is Invalid ",
                                message: "The permit is scanned is not valid",
                                okButtonText: "OK"
                            });
                        } else {
                            return response;
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        self.$store.commit('updateData', data);
                        self.showResult(data)
                    })
                    .catch((e) => {
                        console.log(e);
                    });
                },
                function (errorMessage) {
                    console.log("No scan. " + errorMessage);
                })
            },
            showResult(data) {
                 this.$navigateTo(ScanDetail, {
                    transition: {
                        name:'fade',
                        duration: 200
                    },
                    props: {
                        scan: data
                    }
                })
            },

            fetchHistory() {
                fetch("https://permits.centrisign.co.ke/api/scanHistory", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": "Bearer " + this.$store.getters.token
                    },
                })
                .then(response => response.json())
                .then(response => {
                    this.$store.dispatch("fetchScanHistory",response.data)
                })
                .catch((e) => {
                    console.log(e);
                });
            },

            refreshList(args) {
                var pullRefresh = args.object;
                this.fetchHistory();
                pullRefresh.refreshing = false;
            }
        }      
    }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>