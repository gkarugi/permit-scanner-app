<template>
    <Page>
        <ActionBar title="Permit Scanner" android:flat="true"/>
        <TabView android:tabBackgroundColor="#53ba82"
                 android:tabTextColor="#c4ffdf"
                 android:selectedTabTextColor="#ffffff"
                 androidSelectedTabHighlightColor="#ffffff">
            <TabViewItem title="Scanner">
                <GridLayout columns="*" rows="*">
                    <BarcodeScanner
                        row="1"
                        height="300"
                        formats="QR_CODE, EAN_13, UPC_A"
                        beepOnScan="true"
                        reportDuplicates="true"
                        preferFrontCamera="false"
                        @scanResult="onScanResult"
                        v-if="isIOS">
                    </BarcodeScanner>

                    <Button row="2" class="btn btn-primary btn-rounded-sm" text="Perform scan" @tap="doScanWithBackCamera"></Button>
                </GridLayout>
            </TabViewItem>
            <TabViewItem title="History">
                <GridLayout columns="*" rows="*">
                    <PullToRefresh @refresh="refreshList">
                        <ScrollView>
                            <ListView for="scan in scans" style="height:1250px">
                                <v-template>
                                    <FlexboxLayout flexDirection="row">
                                        <Label :text="scan.permit.permit_number" class="t-12" style="width: 60%" />
                                        <Label :text="scan.permit.created_at" class="t-12" style="width: 60%" />
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

<script >
    import {isIOS} from "tns-core-modules/platform";
    import {BarcodeScanner} from "nativescript-barcodescanner";
    import {ListViewModule} from "tns-core-modules/ui/list-view";

    var geolocation = require("nativescript-geolocation");
    geolocation.enableLocationRequest();

    export default {
        data() {
            return {
                isIOS,
                scans: [],
                needLocation:true,
                locationFailure:false,
                location:null
            }
        },
        created() {
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
                        console.log('loc result', result);
                        this.needLocation = false;
                        this.location = result;
                    })
                    .catch(e => {
                        console.log('loc error', e);
                    });
                });
            });
        },

        methods: {
            onScanResult(evt) {
                console.log(`onScanResult: ${evt.text} (${evt.format})`);
            },
            doScanWithBackCamera() {
                this.scan();
            },

            scan() {
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
                closeCallback: () => {
                    console.log("Scanner closed @ " + new Date().getTime());
                }
            }).then(
                function (result) {
                    const encodeGetParams = p => 
                            Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");
                    
                    const params = {
                        permit_number: result.text,
                        // latitude: this.location.latitude,
                        // longitude:this.location.longitude
                    }  
                    // console.log(params);

                    console.log("https://15a1ef1c.ngrok.io/api/checkPermit?" + encodeGetParams(params));

                    fetch("https://15a1ef1c.ngrok.io/api/checkPermit?" + encodeGetParams(params), {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiNzQ4ZGQ4ZjVhNDkyNDQ2ZDQ0ZmQyZDg4ZTJlMTVjYjVmOGJjM2UzZjUyZGU4Nzk1OGY2YjhmMjU3YmIyODFmNjUwYzk1ZjYyNmJjZDg0ZTIiLCJpYXQiOjE1ODk3MjkwODMsIm5iZiI6MTU4OTcyOTA4MywiZXhwIjoxNjIxMjY1MDgyLCJzdWIiOiIyIiwic2NvcGVzIjpbIioiXX0.XMFocuAW2msVC5dlQYI7eb4h5BM8Le5ru2Bf-cW4P77zzdO-o1_ChXD4Av4_8yqv_VJlFsI50If7g6vJ0eMR9Eoa5sIRLCIHixu1NN-mgjY0Yx8_S-0HfoEaHpQCksvKcEWiub4I6awk-55Tp1Te4n7ZPJ9h7_PC302BjKXX0rKaOrI0qJ2PqOXXtHTdJOVVzbzWrHqdAXNyDoaocT25tTqicOPTTRo1db59N_ltb5dnHjodpI_2jYW6wUaE0J5LLB5yQClZRVybLH9PKkCboVRcx2_c84U0BSZRayHKnVfDwPI0Fv9zQ0POCxraQu7387qSeq3Khgaexn7wDqE6sNSHWzwcyRZiWd0_ayti4lePwiUgNuuWltIaXGfjaYKboZ2nSi9isE-8Pmf2CQs6wY0aPz-PpjGC6HbksZg7JCaPVR3xCfipXiWWTIYP_pGYF5jyahXc6XC7Z0IyQ0G0UZflvm1MBrpSKMAuwHuEvQGfYAAaKL9TeOh7mxKItg8t8olLqTzWTJBxOJY4zT0BBbZrMchvmu3jPnCcdWhk0BUMncsX4DXpCFtWT9ASW5z7DX-CUdiqbwXHCeY_wSeHlyHQ1il4s7TmUwruushSZi1d-CCbxR8uPLEOcCXvjDkKSu-Zc35WKmEsPUEBirdmfZ-CwLGVIbHpv0iKLm1zB8g"
                        },
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log("--- scanned: " + result.text);
                        // Note that this Promise is never invoked when a 'continuousScanCallback' function is provided
                        setTimeout(function () {
                            // if this alert doesn't show up please upgrade to {N} 2.4.0+
                            alert({
                                title: "Scan result ",
                                message: "Valid: " + data.valid,
                                okButtonText: "OK"
                            });
                        }, 500);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
                },
                function (errorMessage) {
                    console.log("No scan. " + errorMessage);
                }
            )},
            getScans() {
                fetch("https://15a1ef1c.ngrok.io/api/scanHistory", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiNzQ4ZGQ4ZjVhNDkyNDQ2ZDQ0ZmQyZDg4ZTJlMTVjYjVmOGJjM2UzZjUyZGU4Nzk1OGY2YjhmMjU3YmIyODFmNjUwYzk1ZjYyNmJjZDg0ZTIiLCJpYXQiOjE1ODk3MjkwODMsIm5iZiI6MTU4OTcyOTA4MywiZXhwIjoxNjIxMjY1MDgyLCJzdWIiOiIyIiwic2NvcGVzIjpbIioiXX0.XMFocuAW2msVC5dlQYI7eb4h5BM8Le5ru2Bf-cW4P77zzdO-o1_ChXD4Av4_8yqv_VJlFsI50If7g6vJ0eMR9Eoa5sIRLCIHixu1NN-mgjY0Yx8_S-0HfoEaHpQCksvKcEWiub4I6awk-55Tp1Te4n7ZPJ9h7_PC302BjKXX0rKaOrI0qJ2PqOXXtHTdJOVVzbzWrHqdAXNyDoaocT25tTqicOPTTRo1db59N_ltb5dnHjodpI_2jYW6wUaE0J5LLB5yQClZRVybLH9PKkCboVRcx2_c84U0BSZRayHKnVfDwPI0Fv9zQ0POCxraQu7387qSeq3Khgaexn7wDqE6sNSHWzwcyRZiWd0_ayti4lePwiUgNuuWltIaXGfjaYKboZ2nSi9isE-8Pmf2CQs6wY0aPz-PpjGC6HbksZg7JCaPVR3xCfipXiWWTIYP_pGYF5jyahXc6XC7Z0IyQ0G0UZflvm1MBrpSKMAuwHuEvQGfYAAaKL9TeOh7mxKItg8t8olLqTzWTJBxOJY4zT0BBbZrMchvmu3jPnCcdWhk0BUMncsX4DXpCFtWT9ASW5z7DX-CUdiqbwXHCeY_wSeHlyHQ1il4s7TmUwruushSZi1d-CCbxR8uPLEOcCXvjDkKSu-Zc35WKmEsPUEBirdmfZ-CwLGVIbHpv0iKLm1zB8g"
                    },
                })
                .then(response => response.json())
                .then(data => {
                    this.scans = data.data
                })
                .catch((e) => {
                    console.log(e);
                });
            },
            refreshList(args) {
                var pullRefresh = args.object;
                this.getScans();
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
