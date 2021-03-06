import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import deliveryApi from "../apis/delivery";
import {
  Container,
  MenuWrapper,
  MenuWrapperHeader,
} from "../Components/common";
import Loading from "../Components/Loading";
import Menu from "../Components/Menu";
import MenuHeader from "../Components/MenuHeader";
import MyResponsiveBar from "../Components/MyResponsiveBar";
import { AREAS, DETAIL_AREAS } from "../constants/delivery_data";
import { loadingState, menuState } from "../state";
import { CONTENTS_BUTTON } from "../constants/Mytown_data";
import Map from "../Components/Map/Map";
import MyCombinedChart from "../Components/MyCombinedChart";
import SorryImg from "../img/sorry.png";
import { STANDARD_TITLE } from "../constants/standard";

const MytownContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.titleColor};
  overflow: scroll;
`;

const MytownBody = styled.div`
  width: 100%;
  height: 100%;
  flex-grow: 5;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 20px;
`;

const MytownMenu = styled(Menu)`
  flex-grow: 1;
  padding: 10px;
  box-sizing: border-box;
`;

const MainContents = styled.div`
  width: 80%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  flex-grow: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SelectWrap = styled(MenuWrapper)`
  width: 100%;
  margin-bottom: 20px;
`;

const ContentsArea = styled(MenuWrapper)`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 600px;
  padding: 10px;
  box-sizing: border-box;
`;

const MapContentsArea = styled(MenuWrapper)`
  width: 600px;
  height: 500px;
  margin-right: 20px;
  box-sizing: border-box;
  padding: 10px;
`;

const GraphContentsArea = styled(MenuWrapper)`
  width: 600px;
  height: 500px;
  box-sizing: border-box;
  padding: 30px 10px 10px 10px;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

//???????????? ??????
const Select = styled.select`
  padding: 5px;
  border-radius: 5px;
  margin-right: 8px;
  width: 130px;
`;

const Option = styled.option`
  border-radius: 5px;
`;

const SelectMessage = styled.div`
  font-size: 22px;
`;

const SubmitBtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  border-radius: 3px;
  height: 28px;
`;

const SorryImgTag = styled.img`
  width: 300px;
  height: 200px;
`;

const Mytown = () => {
  const firstLocation = useRecoilValue(menuState)[0]; //?????? ????????? ??? ????????? ????????? ??????
  const [isLoading, setIsLoading] = useRecoilState(loadingState);
  const [area, setArea] = useState(""); //????????? Select ???/??? ????????? ?????? ?????? ??????
  const [detailArea, setDetailArea] = useState([]); //area??? ???????????? ????????? Select??? ??? ?????? ?????? ??????
  const [dAreaValue, setDAreaValue] = useState(""); //????????? Select??? ???
  const [apiRes, setApiRes] = useState([]); //api ?????? ?????? ?????? ??????
  const [covidApiRes, setCovidApiRes] = useState([]); //????????? api ?????? ?????? ?????? ??????
  const [standardBy, setStandardBy] = useState("by_time"); //????????? ???????????? ?????? (default : ??????)
  const [year, setYear] = useState(2019);

  useEffect(() => {
    console.log(standardBy);
  }, [standardBy]);

  useEffect(() => {
    //????????? Select??? ????????? ?????????
    if (area == "") {
      //????????? Select??? ?????????
      setDetailArea([]);
      return;
    } else {
      DETAIL_AREAS.find((element) => {
        if (element.id == area) {
          setDetailArea(element.value); //????????? Select??? ?????? ??? ??????
        }
      });
      console.log(area);
      //?????? ????????? dAreaValue ??? ????????? ??????
      setDAreaValue("??????");
    }
  }, [area]);

  //?????? ????????? ?????? ???????????? ?????? ?????? ??????
  useEffect(() => {
    if (dAreaValue === "??????") {
      apiExecute();
      return;
    }
    if (dAreaValue !== "") {
      apiExecute();
      return;
    }
  }, [area, dAreaValue]);

  useEffect(() => {
    //?????? ??? ??????????????? api ??????
    if (area !== "" && dAreaValue !== "") {
      apiExecute();
    }
    if (standardBy === "by_corona") {
      setApiRes([]);
      apiExecute();
    }
    if (standardBy !== "by_corona") {
      setCovidApiRes([]);
      apiExecute();
    }
  }, [standardBy]);

  useEffect(() => {
    apiExecute();
    return;
  }, [year]);

  //apiRes ??????
  useEffect(() => {
    console.log(apiRes);
    console.log(covidApiRes);
  }, [apiRes, covidApiRes]);

  //???????????? ?????? ????????? ??????
  const searchArea = () => {
    //????????? ???????????? ????????? ????????????
    if (area === "") {
      alert("???/?????? ??????????????????!");
      return;
    }
    if (dAreaValue === "") {
      alert("???/?????? ??????????????????!");
      return;
    }
    apiExecute();
  };

  //api ???????????? ?????????
  const apiExecute = async () => {
    try {
      //?????? ?????? (?????? ????????? ?????? ?????? ???????????? ????????? ?????? ?????? ?????? default ?????? ?????? ?????? ) ?????? ????????? ??????
      setIsLoading(true);
      switch (standardBy) {
        case "by_time":
          console.log("????????? ??????");
          await deliveryApi
            .get_Time_Average(area, dAreaValue)
            .then((response) => {
              setApiRes(response.data);
              console.log(response.data);
              response.data.map((i, idx) =>
                console.log(i["time"], i["freqavg"])
              );
            });
          break;
        case "by_day":
          console.log("????????? ??????");
          await deliveryApi
            .get_Day_Average(area, dAreaValue)
            .then((response) => {
              setApiRes(response.data);
              console.log(response.data);
              response.data.map((i, idx) =>
                console.log(i["day"], i["freqavg"])
              );
            });
          break;
        case "by_holiday":
          console.log("???????????? ??????");
          await deliveryApi
            .get_Holiday_Average(area, dAreaValue)
            .then((response) => {
              let res = response.data.filter((it) => it.year == year);
              console.log(res);
              setApiRes(res);
              res.map((i, idx) => console.log(i["year"], typeof i["year"]));
            });
          break;
        // ?????? ?????? - ???????????? ????????? ?????????
        case "by_corona":
          console.log("???????????? ??????");
          await deliveryApi.get_Delta_Sum(area).then((res) => {
            console.log(res.data);
            const newData = res.data.map((data) => {
              return {
                year_month: data.year_month,
                ????????????: data.sum,
                "???????????? ????????? ?????????": data.delta,
              };
            });
            setCovidApiRes(newData);
          });
          break;
      }

      // await deliveryApi.get_Time_Average(area, dAreaValue).then((response) => {
      //   setApiRes(response.data);
      //   response.data.map((i, idx) => console.log(i["time"], i["freqavg"]));
      // });
    } catch (e) {
      console.log(e);
    }
    //?????? ??????
    setIsLoading(false);
  };

  //????????? ????????? ?????? ??????
  const changeFirstSelect = (e) => {
    setArea(e.target.value);
  };

  //????????? ????????? ?????? ??????
  const changeSecondSelect = (e) => {
    setDAreaValue(e.target.value);
  };

  const changeStandardBySelect = (e) => {
    setStandardBy(e.target.value);
  };

  //?????? ??????
  const changeYear = (e) => {
    console.log(typeof parseInt(e.target.value));
    console.log(parseInt(e.target.value));
    setYear(parseInt(e.target.value));
  };

  return (
    <MytownContainer>
      <MenuHeader />
      <MytownBody>
        <MytownMenu />
        <MainContents>
          <SelectWrap>
            <SelectContainer>
              <Select name="areaData" onChange={changeFirstSelect} value={area}>
                <Option value="">???/??? ??????</Option>
                {AREAS.map((item) => {
                  return (
                    <Option key={`key_${item}`} value={item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
              <Select onChange={changeSecondSelect} value={dAreaValue}>
                <Option value="">???/??? ??????</Option>
                {detailArea.length !== 0 &&
                  detailArea.map((item) => {
                    return (
                      <Option key={`key_${item}`} value={item}>
                        {item}
                      </Option>
                    );
                  })}
              </Select>
              <SelectMessage>????????? ?????? ?????????</SelectMessage>
            </SelectContainer>

            <SubmitBtnContainer>
              <Select onChange={changeStandardBySelect} value={standardBy}>
                <Option value="by_time">????????? ??????</Option>
                <Option value="by_day">????????? ??????</Option>
                <Option value="by_holiday">???????????? ??????</Option>
                <Option value="by_corona">???????????? ??????</Option>
              </Select>
              {standardBy === "by_holiday" && (
                <Select onChange={changeYear} value={year}>
                  <Option value="2019">2019</Option>
                  <Option value="2020">2020</Option>
                  <Option value="2021">2021</Option>
                </Select>
              )}
              <SubmitButton onClick={searchArea}>
                {CONTENTS_BUTTON}
              </SubmitButton>
            </SubmitBtnContainer>
          </SelectWrap>
          <ContentsArea>
            <MapContentsArea>
              <MenuWrapperHeader>????????? ??????</MenuWrapperHeader>
              <Map area={area} setArea={setArea} />
            </MapContentsArea>
            <GraphContentsArea>
              {!isLoading && apiRes.length !== 0 && standardBy !== "by_corona" && (
                <MenuWrapperHeader>
                  <span>
                    {area} {dAreaValue}
                  </span>
                  <span>{STANDARD_TITLE[standardBy]}</span>
                </MenuWrapperHeader>
              )}
              {!isLoading &&
                apiRes.length !== 0 &&
                standardBy !== "by_corona" && (
                  <MyResponsiveBar data={apiRes} standardBy={standardBy} />
                )}
              {!isLoading &&
                covidApiRes.length !== 0 &&
                standardBy === "by_corona" && (
                  <MenuWrapperHeader>
                    <span>
                      {area} {dAreaValue}
                    </span>
                    <span>{STANDARD_TITLE[standardBy]}</span>
                  </MenuWrapperHeader>
                )}

              {!isLoading &&
                covidApiRes.length !== 0 &&
                standardBy === "by_corona" && (
                  <MyCombinedChart data={covidApiRes} />
                )}
              {!isLoading &&
                standardBy !== "by_corona" &&
                apiRes.length === 0 && <SorryImgTag src={SorryImg} />}
              {area !== "" &&
                !isLoading &&
                standardBy === "by_corona" &&
                covidApiRes.length === 0 && <SorryImgTag src={SorryImg} />}
            </GraphContentsArea>
          </ContentsArea>
        </MainContents>
      </MytownBody>
    </MytownContainer>
  );
};

export default Mytown;
