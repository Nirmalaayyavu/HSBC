import React from "react";
import ReactDOM from 'react-dom';
import { render,  waitFor, act, cleanup,fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axiosMock from "axios";
import App from "./App";
import * as Constant from './constant'




afterEach(cleanup)


test("check Initial render ", async () => {
  const { getByTestId } = render(<App />)
  expect(getByTestId('loader')).toHaveTextContent('Loading..')
})

test("check fetch data call on useEffect part", async () => {
  axiosMock.get = jest
    .fn()
    .mockResolvedValueOnce({
      data: { 
        "zones": [
          { "countryCode": "AD", "countryName": "Andorra", "zoneName": "Europe\/Andorra", "gmtOffset": 7200, "timestamp": 1617866241 },
          { "countryCode": "AE", "countryName": "United Arab Emirates", "zoneName": "Asia\/Dubai", "gmtOffset": 14400, "timestamp": 1617873441 }
        ] }
    })
    .mockResolvedValueOnce({
      data: {
        "zoneName": "Europe\/Andorra",
        "formatted": 1617866241
      }
    })

  // Spy on spread method so that we can wait for it to be called.
  jest.spyOn(axiosMock, "spread");
  const { getByTestId } = render(<App />);
  await waitFor(() =>{ 
    expect(axiosMock.get).toHaveBeenCalledTimes(2)
    expect(axiosMock.spread).toHaveBeenCalledTimes(1)
    expect(getByTestId('time-display')).toHaveTextContent("Time in Europe - Andorra : 10:54 PM")
    expect(screen.getByText(Constant.DROPDOWN_TITLE)).toBeDefined() 
    

  });
  

})




