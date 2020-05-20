import * as schema from '../schema'
import { normalize } from 'normalizr'

export default {
    state: {
        entities: {
            occupants: {},
            permits: {},
            scans: {},
            vehicles: {}
        }
    },

    mutations: {

    },

    actions: {

    },

    scannerInit() {
        fetch(process.env.API_DOMAIN +  "/api/scanHistory", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiNzQ4ZGQ4ZjVhNDkyNDQ2ZDQ0ZmQyZDg4ZTJlMTVjYjVmOGJjM2UzZjUyZGU4Nzk1OGY2YjhmMjU3YmIyODFmNjUwYzk1ZjYyNmJjZDg0ZTIiLCJpYXQiOjE1ODk3MjkwODMsIm5iZiI6MTU4OTcyOTA4MywiZXhwIjoxNjIxMjY1MDgyLCJzdWIiOiIyIiwic2NvcGVzIjpbIioiXX0.XMFocuAW2msVC5dlQYI7eb4h5BM8Le5ru2Bf-cW4P77zzdO-o1_ChXD4Av4_8yqv_VJlFsI50If7g6vJ0eMR9Eoa5sIRLCIHixu1NN-mgjY0Yx8_S-0HfoEaHpQCksvKcEWiub4I6awk-55Tp1Te4n7ZPJ9h7_PC302BjKXX0rKaOrI0qJ2PqOXXtHTdJOVVzbzWrHqdAXNyDoaocT25tTqicOPTTRo1db59N_ltb5dnHjodpI_2jYW6wUaE0J5LLB5yQClZRVybLH9PKkCboVRcx2_c84U0BSZRayHKnVfDwPI0Fv9zQ0POCxraQu7387qSeq3Khgaexn7wDqE6sNSHWzwcyRZiWd0_ayti4lePwiUgNuuWltIaXGfjaYKboZ2nSi9isE-8Pmf2CQs6wY0aPz-PpjGC6HbksZg7JCaPVR3xCfipXiWWTIYP_pGYF5jyahXc6XC7Z0IyQ0G0UZflvm1MBrpSKMAuwHuEvQGfYAAaKL9TeOh7mxKItg8t8olLqTzWTJBxOJY4zT0BBbZrMchvmu3jPnCcdWhk0BUMncsX4DXpCFtWT9ASW5z7DX-CUdiqbwXHCeY_wSeHlyHQ1il4s7TmUwruushSZi1d-CCbxR8uPLEOcCXvjDkKSu-Zc35WKmEsPUEBirdmfZ-CwLGVIbHpv0iKLm1zB8g"
            },
        })
        .then(response => response.json())
        .then(data => {
            
        })
        .catch((e) => {
            console.log(e);
        });
    }
}