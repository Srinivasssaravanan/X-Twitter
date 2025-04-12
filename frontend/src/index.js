import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';// browserrouter is aa component provided by React Router(a library for routing in React applications) to handle navigation and URL management in a web application  It uses the HTML5 history API to keep the UI in sync with the URL.|| HTML5 History API: It uses the browser's history API (like pushState, replaceState) to manipulate the URL in the address bar without reloading the page

import {
  QueryClient,  // query client is like your data manager. think queryclient as like your brain of react query it knows what data you fetched,when you fetched,whether its fresh or stale,whether to refetch. considr queryclient as like a memory box. When your component uses useQuery, it fetches data only once and saves it. This data is stored in memory in the QueryClient.If the component re-renders, React Query checks the cache first.If data is still fresh (not expired), it won’t make another API call. It just gives you the cached data.
  QueryClientProvider, // refer usage of queryclient over other method.
  useQuery,//QueryClientProvider is like giving React Query the keys to your app so it can take care of fetching and managing data for you.QCP gives access to query client to access your app
} from '@tanstack/react-query'

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
  <React.StrictMode> 
      <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        </QueryClientProvider>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
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

React Query helps save and reuse fetched data to avoid doing the same work again and again — like asking your teacher the same question when you've already written the answer in your notes!

Auto caching	,Background refetching	,Refetch on window focus	,Retries on failure	,Stale data handling	,Pagination & Infinite scrolling	,Parallel & Dependent queries	,Devtools to debug data fetching	,Global query config (like headers)	,Shared cache across components

refetch on window focus : refetchOnWindowFocus: true => if user switches tab and came back to twitter then it will show refetched data only if staletime is over. both staletime and refetchwindowfocus work together here.

if i use staletime alone as 1 minutes. iam in homepage if at 30th second if i switch from home to profile and profile to home data will not get refetched. if after 1 minutes if i still in the same home page then the data became stale and its not refetched then if i  move from home to profile and profile to home the data will be refetched. if i use staletime and move from one to another only if staletime is over then data will be refetche if i move the tabs but if i use both then it gets automatically refetched unless switching tabs
refetching occurs in staletime when you switch and refetching occurs automatically in background when we use refetchinterval
consider refetchintervaal is 30sec am using only this alone if iam in 10th sec and switching from home page to profile page and profile to home page then at 10th sec refetching occurs 
if  i use staletime alone as 1 minutes. then refetch occurs only if i switch tabs or home to profile but if i use both then automatic refresh occurs
if i use refetchinterval alone the data is consider as stale all time and gets refetched again and again if i switch tabs irrespective of refetchinterval of 30sec
*/