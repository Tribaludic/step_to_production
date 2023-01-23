import { React, useState, useEffect } from 'react';
//import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import "primeflex/primeflex.css"
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Mention } from 'primereact/mention';
import { MultiSelect } from 'primereact/multiselect';
import { FileUpload } from 'primereact/fileupload';
import {Button} from "primereact/button";

function App() {

  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let prevMonth = (month === 0) ? 11 : month - 1;
  let prevYear = (prevMonth === 11) ? year - 1 : year;
  let nextMonth = (month === 11) ? 0 : month + 1;
  let nextYear = (nextMonth === 0) ? year + 1 : year;

  const solicitudTypes = [
    { label: 'Normal', value: 'N' },
    { label: 'Urgente', value: 'U' },
  ];

  const productTypes = [
    { label: 'Nueva', value: 'N' },
    { label: 'Actualización', value: 'A' },
    { label: 'Migracion', value: 'M' },
  ];

  const useWebServices = [
    { label: 'Si', value: 'S' },
    { label: 'Parcialmente', value: 'P' },
    { label: 'No', value: 'N' },
  ];

  const operativeSystems = [
    { label: 'Windows', value: 'W' },
    { label: 'Linux', value: 'L' },
  ];

  const [solicitudDate, setSolicitudDate] = useState(null);
  const [solicitedByName, setSolicitedByName] = useState('');
  const [solicitudType, setSolicitudType] = useState('N');
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('N');
  const [productVersion, setProductVersion] = useState('1.0.0');
  const [productVersionDisabled, setProductVersionDisabled] = useState(true);
  const [productDetails, setProductDetails] = useState('');
  const [databases, setDatabases] = useState([]);
  const [useWebService, setUseWebService] = useState('S');
  const [solicitedByEmail, setSolicitedByEmail] = useState('');
  const [operativeSystem, setOperativeSystem] = useState('L');
  const [pathDev, setPathDev] = useState('');
  const [pathTest, setPathTest] = useState('');
  const [pathProd, setPathProd] = useState('');
  const [databaseChanges, setDatabaseChanges] = useState('');  
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [workTeam, setWorkTeam] = useState([]);
  const [teamReqSuggestions, setTeamReqSuggestions] = useState([]);
  const [teamDesignSuggestions, setTeamDesignSuggestions] = useState([]);
  const [teamDevFSuggestions, setTeamDevFSuggestions] = useState([]);
  const [teamDevBSuggestions, setTeamDevBSuggestions] = useState([]);
  const [teamTestsSuggestions, setTeamTestsSuggestions] = useState([]);
  const [teamPassProdBSuggestions, setTeamPassProdBSuggestions] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

  const onSave = () => {

    setSaveLoading(true);

    setTimeout(() => {
      setSaveLoading(false);
      console.log(formatDate(solicitudDate));
    }, 2000);
  }

  const onDatabaseChange = (e) => {
    let selecteddatabases = [...databases];
    if (e.checked)
      selecteddatabases.push(e.value);
    else
      selecteddatabases.splice(selecteddatabases.indexOf(e.value), 1);

    setDatabases(selecteddatabases);
  }

  function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  function onChangeProductType(e) {
    setProductType(e.value);
    if (e.value == 'N') {
      setProductVersion('1.0.0');
      setProductVersionDisabled(true);
    } else {
      setProductVersionDisabled(false);
    }
  }

  let minDate = new Date();
  minDate.setMonth(prevMonth);
  minDate.setFullYear(prevYear);

  let maxDate = new Date();
  maxDate.setMonth(nextMonth);
  maxDate.setFullYear(nextYear);

  useEffect(() => {
    fetch('https://gpapis.usfq.edu.ec/APISNominaGP/api/NominaGP/PersonaAreaPorColegio?token=QVBJUy9VU0ZRX05PTUlOQS9QUlVFQkE=&colegio=25')
      .then(response => response.json())
      .then(data => setWorkTeam(data));
  }, []);

  useEffect(() => {
    fetch('https://gpapis.usfq.edu.ec/APISNominaGP/api/NominaGP/Colegios?token=QVBJUy9VU0ZRX05PTUlOQS9QUlVFQkE=')
      .then(response => response.json())
      .then(data => {
        setDepartments(data)
      });
  }, []);



  const capitalize = (str) =>
    (str.toLowerCase()).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

  function responsableTemplate(suggestion) {
    
    return (
      <div className="flex align-items-center">
        <span className="flex flex-column ml-2">
          {capitalize(suggestion.nombre_completo)}
          <small style={{ fontSize: '.75rem', color: 'var(--text-secondary-color)' }}>{suggestion.area}</small>
        </span>
      </div>
    );
  }

  const selectedResponsableTemplate = (option) => {
    if (option) {     
      let personName = workTeam.find(element => element.banner_id == option);      
        return (       
            <div className='p-1'>                
                <div>{capitalize(personName.nombre_completo)}</div>
            </div>
        );
    }

    return "Seleccionar Responsable";
}

  addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
  });

  return (
    <div>
      <div className="card p-1">
        <div className="card card border-solid border-1">
          <div className="bg-red-700 font-bold text-center p-4 mb-3 text-white">
            SISTEMA DE PASO A PRODUCCION
          </div>

          <div className="card p-2">

            <div className="card border-solid border-1">

              <div className="surface-900 font-bold text-center p-3 mb-3 text-white">
                DATOS DE SOLICITUD
              </div>

              <div className="p-fluid grid formgrid p-3">
                <div className="field col-12 md:col-4">
                  <label htmlFor="solicitudDate">FECHA DE SOLICITUD</label>
                  <Calendar id="solicitudDate" value={solicitudDate} onChange={(e) => setSolicitudDate(e.value)} minDate={minDate} maxDate={maxDate} showIcon />
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="solicitedByName">SOLICITADO POR (CONTACTO)</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText id='solicitedByName' value={solicitedByName} onChange={(e) => setSolicitedByName(e.target.value)} placeholder="Nombre Contacto" />
                  </div>
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="solicitedByEmail">SOLICITADO POR (EMAIL)</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-inbox"></i>
                    </span>
                    <InputText id='solicitedByEmail' value={solicitedByEmail} onChange={(e) => setSolicitedByEmail(e.target.value)} placeholder="Email al que se notificará de estos cambios" />
                  </div>
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="department">SOLICITADO POR (DEPARTAMENTO)</label>
                  <Dropdown optionLabel="colegio_nombre" optionValue="colegio_id" id='department' value={department} options={departments} onChange={(e) => setDepartment(e.value)} placeholder="Seleccionar Departamento" />
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="solicitudType">TIPO DE SOLICITUD</label>
                  <Dropdown id='solicitudType' value={solicitudType} options={solicitudTypes} onChange={(e) => setSolicitudType(e.value)} />
                </div>

              </div>
            </div>

            <div className="card border-solid border-1">
              <div className="surface-900 font-bold text-center p-3 mb-3 text-white">
                DATOS DEL PRODUCTO
              </div>

              <div className="p-fluid grid formgrid p-3">

                <div className="field col-12 md:col-4">
                  <label htmlFor="productName">APLICACION O SISTEMA</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-box"></i>
                    </span>
                    <InputText id='productName' value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Nombre" />
                  </div>
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="solicitudType">TIPO DE APLICACION</label>
                  <Dropdown id='solicitudType' value={productType} options={productTypes} onChange={(e) => onChangeProductType(e)} />
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="productVersion">VERSION</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-code"></i>
                    </span>
                    <InputMask id='productVersion' mask="9.9.9" value={productVersion} onChange={(e) => setProductVersion(e.value)} disabled={productVersionDisabled} />
                  </div>
                </div>

                <div className="field col-12 md:col-12">
                  <label htmlFor="productDetails">DETALLES / NOVEDADES / FUNCIONALIDADES</label>
                  <InputTextarea id='productDetails' rows={5} cols={30} value={productDetails} onChange={(e) => setProductDetails(e.target.value)} />
                </div>

              </div>
            </div>

            <div className="card border-solid border-1">
              <div className="surface-900 font-bold text-center p-3 mb-3 text-white">
                INFRAESTRUCTURA DEL PRODUCTO
              </div>

              <div className="p-fluid grid formgrid p-3">

                <div className="field col-12 md:col-6 xl:col-4">
                  <label htmlFor="productName">REPOSITORIO GIT URL</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-github"></i>
                    </span>
                    <InputText id='productName' value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="https://d-gitlab-01.usfq.edu.ec/HUBI/..." />
                  </div>
                </div>

                <div className="field col-12 md:col-6 xl:col-4">
                  <label htmlFor="useWebService">USA SERVICIOS WEB</label>
                  <Dropdown id='useWebService' value={useWebService} options={useWebServices} onChange={(e) => setUseWebService(e.value)} />
                </div>

                <div className="field col-12 md:col-6 xl:col-4">
                  <label htmlFor="operativeSystem">SISTEMA OPERATIVO (APLICACION FRONT-END)</label>
                  <Dropdown id='operativeSystem' value={operativeSystem} options={operativeSystems} onChange={(e) => setOperativeSystem(e.value)} />
                </div>

                <div className="field col-12 md:col-6 xl:col-4">
                  <label htmlFor="pathDev">PATH (AMBIENTE DESARROLLO)</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      https://
                    </span>
                    <InputText id='pathDev' value={pathDev} onChange={(e) => setPathDev(e.target.value)} />
                  </div>
                </div>

                <div className="field col-12 md:col-6 xl:col-4">
                  <label htmlFor="pathTest">PATH (AMBIENTE TEST)</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      https://
                    </span>
                    <InputText id='pathTest' value={pathTest} onChange={(e) => setPathTest(e.target.value)} />
                  </div>
                </div>

                <div className="field col-12 md:col-6 xl:col-4">
                  <label htmlFor="pathProd">PATH (AMBIENTE PRODUCCION)</label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      https://
                    </span>
                    <InputText id='pathProd' value={pathProd} onChange={(e) => setPathProd(e.target.value)} />
                  </div>
                </div>

                <div className="field col-12 md:col-4">
                  <label>BASES DE DATOS</label>
                  <div className="col">
                    <Checkbox inputId="cbOracle" value="New York" onChange={onDatabaseChange} checked={databases.includes('New York')}/>
                    <label htmlFor="cbOracle" className="p-checkbox-label ml-2">Oracle</label>
                  </div>
                  <div className="col mt-2">
                    <Checkbox inputId="cbSqlServer" value="San Francisco" onChange={onDatabaseChange} checked={databases.includes('San Francisco')}/>
                    <label htmlFor="cbSqlServer" className="p-checkbox-label  ml-2">Microsoft SQL Server</label>
                  </div>
                </div>

                <div className="field col-12 md:col-8">
                  <label htmlFor="databaseChanges">CAMBIOS A NIVEL DE BASE DE DATOS (TABLAS / PROCEDIMIENTOS / FUNCIONES / ETC)</label>
                  <InputTextarea id='databaseChanges' rows={5} cols={30} value={databaseChanges} onChange={(e) => setDatabaseChanges(e.target.value)} />
                </div>

              </div>
            </div>

            <div className="card border-solid border-1">
              <div className="surface-900 font-bold text-center p-3 mb-3 text-white">
                EQUIPO DE TRABAJO
              </div>

              <div className="p-fluid grid formgrid p-3">

                <div className="field col-12 md:col-4">
                  <label htmlFor="teamRequirements">REQURIMIENTOS</label>
                  <MultiSelect 
                    id='teamRequirements'
                    value={teamReqSuggestions}
                    options={workTeam}
                    onChange={(e) => setTeamReqSuggestions(e.value)}
                    optionLabel="nombre_completo"
                    optionValue="banner_id"
                    placeholder="Seleccionar Responsable"
                    filter={true}
                    itemTemplate={responsableTemplate}     
                    selectedItemTemplate={selectedResponsableTemplate}                             
                  />
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="teamRequirements">DISEÑO</label>
                  <MultiSelect value={teamDesignSuggestions}
                    options={workTeam}
                    onChange={(e) => setTeamDesignSuggestions(e.value)}
                    optionLabel="nombre_completo"
                    optionValue="banner_id"
                    placeholder="Seleccionar Responsable"
                    filter={true}
                    itemTemplate={responsableTemplate}      
                    selectedItemTemplate={selectedResponsableTemplate}               
                  />
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="teamRequirements">DESARROLLO (FRONT-END)</label>
                  <MultiSelect value={teamDevFSuggestions}
                    options={workTeam}
                    onChange={(e) => setTeamDevFSuggestions(e.value)}
                    optionLabel="nombre_completo"
                    optionValue="banner_id"
                    placeholder="Seleccionar Responsable"
                    filter={true}
                    itemTemplate={responsableTemplate}        
                    selectedItemTemplate={selectedResponsableTemplate}             
                  />
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="teamRequirements">DESARROLLO (BACK-END)</label>
                  <MultiSelect value={teamDevBSuggestions}
                    options={workTeam}
                    onChange={(e) => setTeamDevBSuggestions(e.value)}
                    optionLabel="nombre_completo"
                    optionValue="banner_id"
                    placeholder="Seleccionar Responsable"
                    filter={true}
                    itemTemplate={responsableTemplate}        
                    selectedItemTemplate={selectedResponsableTemplate}             
                  />
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="teamRequirements">PRUEBAS</label>
                  <MultiSelect value={teamTestsSuggestions}
                    options={workTeam}
                    onChange={(e) => setTeamTestsSuggestions(e.value)}
                    optionLabel="nombre_completo"
                    optionValue="banner_id"
                    placeholder="Seleccionar Responsable"
                    filter={true}
                    itemTemplate={responsableTemplate}    
                    selectedItemTemplate={selectedResponsableTemplate}                 
                  />
                </div>

                <div className="field col-12 md:col-4">
                  <label htmlFor="teamRequirements">PASO A PRODUCCION</label>
                  <MultiSelect value={teamPassProdBSuggestions}
                    options={workTeam}
                    onChange={(e) => setTeamPassProdBSuggestions(e.value)}
                    optionLabel="nombre_completo"
                    optionValue="banner_id"
                    placeholder="Seleccionar Responsable"
                    filter={true}
                    itemTemplate={responsableTemplate}    
                    selectedItemTemplate={selectedResponsableTemplate}                 
                  />
                </div>

              </div>
            </div>


            <div className="card border-solid border-1">
              <div className="surface-900 font-bold text-center p-3 mb-3 text-white">
                ANEXOS
              </div>
              <FileUpload name="demo[]" url="./upload" multiple />
            </div>

            <div className="mt-8">
            </div>

          </div>




        </div>
        <div className="surface-900 text-center p-3 mb-3">
          <Button label="Save" icon="pi pi-save" loading={saveLoading} onClick={onSave}/>
        </div>
      </div>

    </div>
  );
}

export default App;
