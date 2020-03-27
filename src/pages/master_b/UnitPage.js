import Page from 'components/Page';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, ButtonGroup, InputGroup,
    InputGroupAddon, Form, input
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle, MdSearch, MdAutorenew } from 'react-icons/md';

import {
    MdLoyalty,
} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from '../urlLink';

import * as firebase from 'firebase/app';

const perf = firebase.performance();

class UnitPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            inputtedName: '',
            currentPage: 1,
            realCurrentPage: 1,
            todosPerPage: 5,
            maxPage: 1,
            flag: 0,
            keyword: '',
            active_user_id: "10",
            loading: false,
            enterButton: false,
        };
    }

    //set Current Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value, currentPage: 1, realCurrentPage: 1 }, () => {
            this.getListbyPaging(1, this.state.todosPerPage, this.state.keyword);
        });
    }

    //set Current Page
    paginationButton(event, flag, maxPage = 0) {
        var currPage = Number(event.target.value);
        if ((currPage + flag) > 0 && (currPage + flag) <= maxPage) {
            this.setState({
                currentPage: (currPage + flag),
                realCurrentPage: (currPage + flag),
            }, () => {
                this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword);
            });
        }
    }

    pagination = (value, arrow, maxPage = 0) => {
        var currPage = Number(value);
        if ((currPage + arrow) > 0 && (currPage + arrow) <= maxPage) {
            this.setState({
                currentPage: (currPage + arrow),
                realCurrentPage: (currPage + arrow),
            }, () => {
                this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword);
            });
        }
        
    }

    shortcutKey = (e) => {
        var code = e.keyCode || e.which;
        if (code === 112) {
            this.toggle('nested_parent');
        }
    }

    enterPressedPage = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            if (this.state.currentPage > 0) {
                if (this.state.currentPage > this.state.maxPage) {
                    this.setState(prevState => ({
                        realCurrentPage: prevState.maxPage,
                        currentPage: prevState.maxPage
                    }), () => this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword));
                } else {
                    this.setState(prevState => ({
                        realCurrentPage: prevState.currentPage
                    }), () => this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword));
                }
            }
        }
    }
    enterPressedSearch = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            event.preventDefault();
            this.setState({ currentPage: 1, realCurrentPage: 1 }
                , () => { this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword); });
        }
    }

    showNotification = (currMessage, levelType) => {
        setTimeout(() => {
            if (!this.notificationSystem) {
                return;
            }
            this.notificationSystem.addNotification({
                title: <MdLoyalty />,
                message:
                    currMessage,
                level: levelType,
            });
        }, 300);
    }

    getListbyPaging(currPage, currLimit, kword) {
        const trace = perf.trace('getUnitList');
        trace.start();

        const urlA = myUrl.url_getUnitListByPaging;
        var payload = {
            offset: (currPage - 1) * currLimit,
            limit: currLimit,
            keyword: kword,

        };

        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }

        fetch(urlA, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }
                } else {
                    this.setState({ result: data, maxPage: data.page ? data.page : 1, loading: false });
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }
            ).then(() => { this.setState({ loading: false }) });


    }

    componentDidMount() {
        this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    }

    insertMasterUnit = param => () => {
        const trace = perf.trace('newUnit');
        trace.start();
        const uname = param;
        var url = myUrl.url_insertMasterUnit;
        this.fetchData();

        var payload = {
            unit_name: uname.trim(),
            unit_userid: this.state.active_user_id,
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_nested: false,
                        modal_nested_parent: false,
                        inputtedName: '',
                        loading: false
                    });
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(() => { this.setState({ loading: false }) });
    }

    insertMasterShortcut = param => {
        const trace = perf.trace('newUnit');
        trace.start();
        const uname = param;
        var url = myUrl.url_insertMasterUnit;
        this.fetchData();
        this.setState({ enterButton: true })

        var payload = {
            unit_name: uname.trim(),
            unit_userid: this.state.active_user_id,
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_nested: false,
                        modal_nested_parent: false,
                        inputtedName: '',
                        loading: false, enterButton: false
                    });
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(() => { this.setState({ loading: false, enterButton: false }) });
    }




    setUnitActiveYN = (first_param, second_param) => () => {

        const trace = perf.trace('updateStatusUnit');
        trace.start();
        var url = myUrl.url_setUnitActiveYN;
        this.fetchData();
        var payload = {
            unit_name: second_param.unit_name,
            unit_code: second_param.unit_code,
            unit_runningid: second_param.unit_runningID,
            unit_activeyn: first_param,
            unit_userID: this.state.active_user_id
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_active: false,
                        modal_deactive: false,
                        loading: false
                    });
                    return response.json()
                }
                else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            });
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    //modal update
    state = {
        modal_active: false,
        modal_deactive: false,
        active_unitcode_deactive: {},
        active_unitcode_active: {},
        modal_active_toggle: "",
        modal_deactive_toggle: "",
    };

    toggleDeactiveData = (todo) => {
        this.setState({
            modal_deactive_toggle: "deactive_toggle",
            modal_deactive: true,
            active_unitcode_deactive: todo,
        });
    }

    toggleActiveData = (todo) => {
        this.setState({
            modal_active_toggle: "active_toggle",
            modal_active: true,
            active_unitcode_active: todo,
        });
    }

    toggle = modalType => (event) => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],

        }, () => {
            if (this.state.modal_nested_parent === true) {
                document.getElementById("unit").focus();
            }
        });

    };

    fetchData = () => {
        this.setState({ loading: true });
    };

    handleClose = () => {
        this.setState({ inputtedName: '' });

    }

    removeFocus() {
        document.getElementById("search").focus();
    }

    testFunc = (modalType) => {
        if (this.state.modal_nested_parent && this.state.modal_nested) {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                modal_nested: false
            });
        } else {
            if (!modalType) {
                return this.setState({
                    modal: !this.state.modal
                });
            }

            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],

            });
        }
    }

    render() {
        const { loading } = this.state;
        const currentTodos = this.state.result.result;
        const isEnabled = this.canBeSubmitted();

        const renderTodos = currentTodos && currentTodos.map((todo, i) => {
            return <tr key={i}>
                <th scope="row">{todo.unit_code}</th>
                <td>{todo.unit_name}</td>
                {todo.unit_aktifYN === "Y" &&
                    <td>
                        <Badge color="success" className="mr-1">Aktif</Badge>
                    </td>
                }
                {todo.unit_aktifYN !== "Y" &&
                    <td>
                        <Badge color="danger" className="mr-1">Tidak Aktif</Badge>
                    </td>
                }
                {todo.unit_aktifYN === "Y" &&
                    <td>
                        <Button color="danger" size="sm" onClick={() => this.toggleDeactiveData(todo)}><MdHighlightOff /></Button>
                    </td>
                }
                {todo.unit_aktifYN !== "Y" &&
                    <td>
                        <Button color="success" size="sm" onClick={() => this.toggleActiveData(todo)}><MdCheckCircle /></Button>
                    </td>
                }
            </tr>


        });

        return (
            <Page
                title="Unit"
                breadcrumbs={[{ name: 'unit', active: true }]}
                className="UnitPage"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <NotificationSystem
                                dismissible={false}
                                ref={notificationSystem =>
                                    (this.notificationSystem = notificationSystem)
                                }
                                style={NOTIFICATION_SYSTEM_STYLE}
                            />
                            <CardHeader className="d-flex justify-content-between">
                                <Form inline className="cr-search-form" onSubmit={e => e.preventDefault()}>
                                    <MdSearch
                                        size="20"
                                        className="cr-search-form__icon-search text-secondary"
                                    />
                                    <Input
                                        type="search"
                                        id="search"
                                        className="cr-search-form__input"
                                        placeholder="Search..."
                                        onChange={evt => this.updateSearchValue(evt)}
                                        onKeyPress={event => this.enterPressedSearch(event, true)}
                                    />
                                </Form>
                                <Button size="sm" id="tambah" onClick={this.toggle('nested_parent')}>Tambah</Button>
                                <Modal

                                    onExit={this.handleClose}
                                    isOpen={this.state.modal_nested_parent}
                                    toggle={this.toggle('nested_parent')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Tambah Unit
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Unit</Label>
                                        <Input type="namaunit" autoComplete="off" id="unit" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namaunit" placeholder="Nama Unit (Maksimal 15 Karakter)" />
                                        <br></br>
                                        <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button disabled={!isEnabled} color="primary" onClick={this.toggle('nested')}>
                                            Simpan
                                        </Button>
                                        <Modal
                                            onExit={this.handleClose}
                                            isOpen={this.state.modal_nested}
                                            toggle={this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>
                                                <strong>Nama Unit: {this.state.inputtedName}</strong>
                                                <br />
                                                <br></br>
                                                Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={this.insertMasterUnit(this.state.inputtedName)} disabled={loading}>
                                                    {!loading && <span>Ya</span>}
                                                    {loading && (
                                                        <MdAutorenew />
                                                    )}
                                                    {loading && <span>Sedang diproses</span>}
                                                </Button>{' '}
                                                {!loading && <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested')}>
                                                    Tidak
                                                </Button>}
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                            Batal
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                                {/* Modal untuk Aktif no Aktif  */}
                                <Modal
                                    isOpen={this.state.modal_deactive}
                                    toggle={this.toggle('deactive')}>
                                    <ModalHeader toggle={this.toggle('deactive')}>
                                        Konfirmasi Penonaktifan
                                    </ModalHeader>
                                    <ModalBody>
                                        <strong>Nama Unit: {this.state.active_unitcode_deactive && this.state.active_unitcode_deactive.unit_name}</strong>
                                        <br />
                                        <br></br>
                                        Apakah Anda yakin ingin menonaktifkan data ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.setUnitActiveYN('N', this.state.active_unitcode_deactive)} disabled={loading}>
                                            {!loading && <span>Ya</span>}
                                            {loading && (
                                                <MdAutorenew />
                                            )}
                                            {loading && <span>Sedang diproses</span>}
                                        </Button>{' '}
                                        {!loading && <Button color="secondary" onClick={this.toggle('deactive')}>
                                            Tidak
                                        </Button>}
                                    </ModalFooter>
                                </Modal>
                                <Modal
                                    onExit={() => this.handleClose}
                                    isOpen={this.state.modal_active}
                                    toggle={this.toggle('active')}>
                                    <ModalHeader toggle={this.toggle('active')}>
                                        Konfirmasi Pengaktifan
                                    </ModalHeader>
                                    <ModalBody>
                                        <strong>Nama Unit: {this.state.active_unitcode_active && this.state.active_unitcode_active.unit_name}</strong>
                                        <br />
                                        <br></br>
                                        Apakah Anda yakin ingin mengaktifkan data ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.setUnitActiveYN('Y', this.state.active_unitcode_active)} disabled={loading}>
                                            {!loading && <span>Ya</span>}
                                            {loading && (
                                                <MdAutorenew />
                                            )}
                                            {loading && <span>Sedang diproses</span>}
                                        </Button>{' '}
                                        {!loading && <Button color="secondary" onClick={this.toggle('active')}>
                                            Tidak
                                        </Button>}
                                    </ModalFooter>
                                </Modal>
                            </CardHeader>
                            <CardBody>
                                <Table responsive
                                    striped>
                                    <thead>
                                        <tr>
                                            <td colSpan='4' className="text-right" style={{ border: 'none' }}>
                                                <Label style={{ width: '50%', textAlign: 'left' }}>F1: Tambah, F3: Search</Label>
                                                <Label style={{ width: '50%', textAlign: 'right' }}> {'Halaman : ' + this.state.realCurrentPage + ' / ' + this.state.maxPage}</Label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nama Unit</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {renderTodos}
                                        {!currentTodos && <tr>
                                            <td style={{ backgroundColor: 'white' }} colSpan='4' className="text-center">TIDAK ADA DATA</td>
                                        </tr>}
                                    </tbody>
                                </Table>
                            </CardBody>
                            <CardBody>
                                <Row>
                                    <Col md="9" sm="12" xs="12">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Tampilkan</InputGroupAddon>
                                            <select
                                                name="todosPerPage"
                                                style={{ height: '38px' }}
                                                value={this.state.value}
                                                onChange={(e) => this.handleSelect(e)}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                            </select>
                                            <InputGroupAddon addonType="prepend">Baris Per-Halaman</InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col md="3" sm="12" xs="12">
                                        <Card className="mb-3s">
                                            <ButtonGroup >
                                                <Button
                                                    name="FirstButton"
                                                    value={1}
                                                    onClick={(e) => this.paginationButton(e, 0, this.state.maxPage)}>
                                                    &#10092;&#10092;
                                       </Button>
                                                <Button
                                                    name="PrevButton"
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.paginationButton(e, -1, this.state.maxPage)}>
                                                    &#10092;
                                       </Button>
                                                <input
                                                    type="text"
                                                    placeholder="Page"
                                                    outline='none'
                                                    value={this.state.currentPage}
                                                    onChange={(e) => this.setState({ currentPage: e.target.value })}
                                                    onKeyPress={(e) => this.enterPressedPage(e)}
                                                    style={{ height: '38px', width: '75px', textAlign: 'center' }}
                                                />
                                                <Button
                                                    name="NextButton"
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.paginationButton(e, 1, this.state.maxPage)}>
                                                    &#10093;
                                       </Button>
                                                <Button
                                                    name="LastButton"
                                                    value={this.state.maxPage}
                                                    onClick={(e) => this.paginationButton(e, 0, this.state.maxPage)}>
                                                    &#10093;&#10093;
                                       </Button>
                                            </ButtonGroup>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <script>
                    {document.onkeydown = (e) => {
                        e = e || window.event;
                        if (e.ctrlKey) {
                            switch (e.key) {
                                //ctrl+s untuk modal simpan
                                case "s":
                                    // 
                                    if (this.state.modal_nested_parent && isEnabled === true) {
                                        this.testFunc("nested");
                                    } else if (this.state.modal_nested_parent_edit === true) {
                                        this.testFunc("nested_edit");
                                    }
                                    e.preventDefault();
                                    break;

                                case "S":
                                    // 
                                    if (this.state.modal_nested_parent && isEnabled === true) {
                                        this.testFunc("nested");
                                    } else if (this.state.modal_nested_parent_edit === true) {
                                        this.testFunc("nested_edit");
                                    }
                                    e.preventDefault();
                                    break;

                                //ctrl + kanan untuk last
                                case "ArrowRight":
                                    this.pagination(this.state.maxPage, 0, this.state.maxPage);
                                    e.preventDefault();
                                    break;

                                //ctrl + kiri untuk first
                                case "ArrowLeft":
                                    this.pagination(1, 0, this.state.maxPage);
                                    e.preventDefault();
                                    break;
                            }
                        }
                        switch (e.key) {
                            // enter untuk simpan
                            case "Enter":
                                if (this.state.modal_nested === true && this.state.enterButton === false) { this.insertMasterShortcut(this.state.inputtedName) }
                                // e.preventDefault();
                                break;

                            // f1 untuk tambah
                            case "F1":
                                this.testFunc("nested_parent");
                                document.getElementById("unit").focus();
                                e.preventDefault();
                                break;

                            //f3 untuk search
                            case "F3":
                                document.getElementById("search").focus();
                                e.preventDefault();
                                break;

                            //kanan untuk next
                            case "ArrowRight":
                                if (e.ctrlKey === false) {
                                    this.pagination(this.state.currentPage, 1, this.state.maxPage);
                                }
                                e.preventDefault();
                                break;

                            //kiri untuk prev
                            case "ArrowLeft":
                                if (e.ctrlKey === false) {
                                    this.pagination(this.state.currentPage, -1, this.state.maxPage);
                                }
                                e.preventDefault();
                                break;

                        }
                        //menghilangkan fungsi default tombol
                        // e.preventDefault();
                    }}
                </script>
            </Page>

        );
    }


    canBeSubmitted() {

        const { inputtedName } = this.state;
        return inputtedName.length > 0 && inputtedName.trim() !== "" && inputtedName.trim().length <= 15;
    }

    handleSubmit = evt => {
        if (!this.canBeSubmitted()) {
            evt.preventDefault();
            return;
        }
    };

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    updateSearchValue(evt) {
        this.setState({
            keyword: evt.target.value
        });
    }
}
export default UnitPage;