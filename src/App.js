import React from "react";
import { useEffect, useState } from "react";
import { Input, Space, Table, Typography } from "antd";
import axios from "axios";
const { Search } = Input;
const { Title } = Typography;
const columns = [
  {
    title: "Body",
    dataIndex: "body",
    key: "body",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "UserId",
    dataIndex: "userId",
    key: "userId",
  },
  {
    title: "#",
    dataIndex: "id",
    key: "id",
    render: (text) => <a>{text}</a>,
  },
];

const App = () => {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [tablePageIndex, settablePageIndex] = useState(1);
  const [numberOfTableElements, setnumberOfTableElements] = useState(100);
  const [searchValue, setsearchValue] = useState("");
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts?_page=1&_per_page=10")
      .then((response) => {
        setListOfPosts(response.data);
        settablePageIndex((previousState) => {
          return 1;
        });
      });
  }, []);
  const onChange = (e) => {
    let value = e.target.value;
    axios.get("https://jsonplaceholder.typicode.com/posts").then((response) => {
      let lastResult = [];
      if (value.match(/[^0-9]/) == null && value != "") {
        response.data.forEach((element) => {
          if (element.userId == value) {
            lastResult.push(element);
          }
          if (element.id == value) {
            if (!lastResult.includes(element)) {
              lastResult.push(element);
            }
          }
        });
      }
      response.data.forEach((element) => {
        var regex = new RegExp(value, "g");
        if (element.title.match(regex) != null) {
          if (!lastResult.includes(element)) {
            lastResult.push(element);
          }
        }

        if (element.body.match(regex) != null) {
          if (!lastResult.includes(element)) {
            lastResult.push(element);
          }
        }
      });
      console.log(lastResult);
      setsearchValue(value);
      setnumberOfTableElements(lastResult.length);
      setListOfPosts(lastResult);
    });
  };

  return (
    <Space direction="vertical">
      <Typography>
        <Title type="success" style={{ textAlign: "center" }}>
          Posts Table
        </Title>
      </Typography>
      <Search
        placeholder="input search text"
        onChange={onChange}
        style={{
          width: 200,
        }}
      />
      <Table
        columns={columns}
        dataSource={listOfPosts}
        pagination={{
          current: tablePageIndex,
          total: numberOfTableElements,
          onShowSizeChange: (current, pageSize) => {
            let numberOfElements = pageSize * current;
            let i = 0;
            let newPageIndex = 0;
            while (i <= numberOfTableElements) {
              i = i + pageSize;
              newPageIndex = newPageIndex + 1;
              if (numberOfElements <= i) {
                break;
              }
            }
            let start = (newPageIndex - 1) * pageSize;
            axios
              .get(
                `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${pageSize}`
              )
              .then((response) => {
                let lastResult = [];
                if (searchValue.match(/[^0-9]/) == null && searchValue != "") {
                  response.data.forEach((element) => {
                    if (element.userId == searchValue) {
                      lastResult.push(element);
                    }
                    if (element.id == searchValue) {
                      if (!lastResult.includes(element)) {
                        lastResult.push(element);
                      }
                    }
                  });
                }
                response.data.forEach((element) => {
                  var regex = new RegExp(searchValue, "g");
                  if (element.title.match(regex) != null) {
                    if (!lastResult.includes(element)) {
                      lastResult.push(element);
                    }
                  }

                  if (element.body.match(regex) != null) {
                    if (!lastResult.includes(element)) {
                      lastResult.push(element);
                    }
                  }
                });
                settablePageIndex(newPageIndex);
                setListOfPosts(lastResult);
              });
          },
          onChange: (page, pageSize) => {
            let numberOfElements = pageSize * page;
            let i = 0;
            let newPageIndex = 0;
            while (i <= numberOfTableElements) {
              i = i + pageSize;
              newPageIndex = newPageIndex + 1;
              if (numberOfElements <= i) {
                break;
              }
            }
            let start = (newPageIndex - 1) * pageSize;
            axios
              .get(
                `https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${pageSize}`
              )
              .then((response) => {
                let lastResult = [];
                if (searchValue.match(/[^0-9]/) == null && searchValue != "") {
                  response.data.forEach((element) => {
                    if (element.userId == searchValue) {
                      lastResult.push(element);
                    }
                    if (element.id == searchValue) {
                      if (!lastResult.includes(element)) {
                        lastResult.push(element);
                      }
                    }
                  });
                }
                response.data.forEach((element) => {
                  var regex = new RegExp(searchValue, "g");
                  if (element.title.match(regex) != null) {
                    if (!lastResult.includes(element)) {
                      lastResult.push(element);
                    }
                  }

                  if (element.body.match(regex) != null) {
                    if (!lastResult.includes(element)) {
                      lastResult.push(element);
                    }
                  }
                });
                settablePageIndex(newPageIndex);
                setListOfPosts(lastResult);
              });
          },
        }}
      />
    </Space>
  );
};
export default App;
