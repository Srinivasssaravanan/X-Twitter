import React from 'react';
import ReactDOM from 'react-dom/client'; //import ReactDOM from 'react-dom/client'; is used to create a root container in the webpage where all your React components are rendered and displayed. This root container is typically a <div> element with an id of "root". Once the root is created, React will render your components inside it and display them on the page.
import './index.css';
import App from './App';//Axios is a popular JavaScript library used to make HTTP requests (like GET, POST, PUT, DELETE) from the browser or Node.js.
import { BrowserRouter } from 'react-router-dom';// browserrouter is aa component provided by React Router(a library for routing in React applications) to handle navigation and URL management in a web application  It uses the HTML5 history API to keep the UI in sync with the URL.|| HTML5 History API: It uses the browser's history API (like pushState, replaceState) to manipulate the URL in the address bar without reloading the page

import {
  QueryClient,  // query client is like your data manager. think queryclient as like your brain of react query it knows what data you fetched,when you fetched,whether its fresh or stale,whether to refetch. considr queryclient as like a memory box. When your component uses useQuery, it fetches data only once and saves it. This data is stored in memory in the QueryClient.If the component re-renders, React Query checks the cache first.If data is still fresh (not expired), it won’t make another API call. It just gives you the cached data.
  QueryClientProvider, // refer usage of queryclient over other method.
  useQuery,//QueryClientProvider is like giving React Query the keys to your app so it can take care of fetching and managing data for you.QCP gives access to query client to access your app
} from '@tanstack/react-query'
/*Combined Behavior:
Setting	What happens when you switch tabs and come back?
refetchOnWindowFocus: true + data is stale	It refetches the data
refetchOnWindowFocus: true + data is fresh	It does NOT refetch
refetchOnWindowFocus: false	It never refetches, even if data is stale
*/

/*
refetchOnWindowFocus: false, i have used this because and then i used manual triggering queryClient.invalidateQueries(["yourQueryKey"]); i have used this to avoid unnecessary api calls,. Reduces unnecessary network requests, Better performance ,  Avoids UI flickering or re-renders, Gives you full control.
*/
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,//If you return within the 1-minute staleTime in awitching tabs, no refetch will occur, even with refetchOnWindowFocus: true.
    },//If you have refetchOnWindowFocus: false, React Query will not automatically refetch the data when you return to the page, even if the data has become stale (after 1 minute or more).

    //If you have refetchOnWindowFocus: true, then when you return to the page (after the data is stale), React Query will automatically refetch the data.
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'));
// Wrap your app with QueryClientProvider and BrowserRouter and react.strictmode => it's just a tool to help you catch potential problems early while you’re coding.
root.render(
  <React.StrictMode> {/**<React.StrictMode> is a development tool in React used to highlight potential problems in your application during development */}
      <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        </QueryClientProvider>
      </BrowserRouter>
  </React.StrictMode>
);

/*
babel is a tool which converts jsx to js or html which is called virtual dom element
jsx is converted into js by babel and this is called virtual dom element(a JavaScript object that represents HTML)
then react builds a virtual dom by combining virtual dom element and then the virtual dom is like a tree like structure looks like html
At rendering first time there will be no real and previous virtual dom so react takes the entire virtual dom and creates real dom nodes and inserts the virtual dom into the actual dom

a virtual dom is created and if change in state occurs then a new virtual dom is created and then it is compared with the previous virtual dom by diffing or  Reconciliation . and then react updates the changed part alone in real dom not entire thing(it compares two virtual doms and only changed parts b/w two virtual dom gets updated directly in real dom)
*/



/*
REACT QUERY  :
 You're building a social media app (like Twitter/X), and in that app, you want to:
🔄 Fetch user profile
🐦 Get tweets
💬 Get comments
🧠 Cache the data (so you don’t fetch it every time)
🔁 Automatically update it when it changes
Now… handling this manually in React is HARD 😵
That's why we use React Query (TanStack Query) — it does all this for you automatically.

for automatic refershing we can use  refetchOnWindowFocus:  but it cant be used in usestate+usequery so it needs manual refetching 
React Query helps save and reuse fetched data to avoid doing the same work again and again — like asking your teacher the same question when you've already written the answer in your notes!

Auto caching	,Background refetching	,Refetch on window focus	,Retries on failure	,Stale data handling	,Pagination & Infinite scrolling	,Parallel & Dependent queries	,Devtools to debug data fetching	,Global query config (like headers)	,Shared cache across components

refetch on window focus : refetchOnWindowFocus: true => if user switches tab and came back to twitter then it will show refetched data only if staletime is over. both staletime and refetchwindowfocus work together here.

if i use staletime alone as 1 minutes. iam in homepage if at 30th second if i switch from home to profile and profile to home data will not get refetched. if after 1 minutes if i still in the same home page then the data became stale and its not refetched then if i  move from home to profile and profile to home the data will be refetched. if i use staletime and move from one to another only if staletime is over then data will be refetche if i move the tabs but if i use both then it gets automatically refetched unless switching tabs
refetching occurs in staletime when you switch and refetching occurs automatically in background when we use refetchinterval
consider refetchintervaal is 30sec am using only this alone if iam in 10th sec and switching from home page to profile page and profile to home page then at 10th sec refetching occurs 
if  i use staletime alone as 1 minutes. then refetch occurs only if i switch tabs or home to profile but if i use both then automatic refresh occurs
if i use refetchinterval alone the data is consider as stale all time and gets refetched again and again if i switch tabs irrespective of refetchinterval of 30sec
*/

/*components are combined in <APP/> and they are rendered in index.js*/

/**
 * FETCH AND AXIOS DIFFERENCE :
   fetch is built-in (native):
   It comes preloaded in modern browsers.
   ✅ Use axios if:
You want automatic JSON parsing

You need better error handling (it throws on 4xx/5xx responses)

You want features like:

Request/response interceptors

Timeouts

Request cancellation

Easily manage default headers

You're working on a large or API-heavy app

✅ Use fetch if:
You want a lightweight, no-dependency solution

You're doing simple HTTP requests

You don't mind writing extra code to handle errors and parse responses


   FETCH :
        fecth is used with url by using this you asks the browser to gain info from server but the server sends it in string raw format so json() is used to convert it to json object format
 ERROR HANDLING : Axios will automatically throw an error if the server responds with a bad status (like 404 or 500).

Fetch doesn't automatically throw an error for HTTP errors. You need to manually check if the response is okay and throw an error if needed.
okokk incase of axios it gives automatic checking that is irresepective of errors like 404 or 500 it throws an error but incase of fetch it separately manually checks one by obe wrt both 500 and 404. in axios if it is 404 or 500 it throws same error but in fetch if it is 404 then it handles with response.ok and if it is 500 it throws error 
fetch() won't automatically reject on 404 or 500 errors. You need to check response.ok (which checks if the status code is 200-299) or manually inspect the response.status for other errors like 404 or 500.
response.ok helps you detect if the status is successful (2xx) or if there’s an issue (4xx, 5xx). If it's not OK, you can throw an error manually.

REASON FOR FETCH IN ERROR HANDLING THAN AXIOS : A 404 error might indicate that the resource wasn't found, so you might display a "Not Found" message or redirect the user.
A 500 error typically indicates a server-side issue, so you might want to show a "Server Error" message or prompt the user to try again later.

ADVANTAGE OF FETCH OVER AXIOS :
lightweight,no extra library, controled over is done in fetch than axioslike deciding which must be the response format like json object or text or something,handling raw data from server,error handling.

fetch and axios : by manuallly giving url by user , the browser fetches data from server and returns
  */

/**
    🔧 React Query Features vs. useState + useEffect
React Query Feature	Description	Equivalent in useState + useEffect
✅ refetchOnWindowFocus	Automatically refetches data when window/tab regains focus|||You need to add a window.addEventListener("focus", ...) manually
✅ retry	Retries failed requests automatically (default 3 times)|||	You need to write custom retry logic using recursion or loops
✅ staleTime	Controls how long data stays "fresh"|||	You need to manually cache and manage timestamps
✅ cacheTime	How long unused data stays in memory before garbage collection|||	No built-in caching unless you use external libraries
✅ enabled	Conditionally run a query (e.g., wait for a userId before fetching)|||	Requires if conditions inside useEffect
✅ refetchInterval	Automatically refetch data every X milliseconds|||	You’d use setInterval inside useEffect with cleanup
✅ onSuccess / onError	Built-in lifecycle callbacks for data or error handling|||You manually check and call functions after fetching
✅ isLoading, isFetching, isError, data	Prebuilt states you can use directly in UI|||	You’d need to manage multiple state variables (loading, error, data, etc.)
✅ queryKey	Caches data uniquely per key, avoiding duplicate requests|||	Manual and error-prone with useEffect
✅ Devtools	Visual interface to debug queries|||	No such tool with useEffect, manual console.logs needed 

 */