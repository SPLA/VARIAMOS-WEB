import { setupModal, modalH3, modalButton } from '../../../common/util'

let setupEvents = function setupEvents(graph){
    const texts = ['Adjustment variable: ',
    "Delay[𝜃](Time it takes for the system output to increase): ", "Discrete Time : "];
    const default_vals = ["","",""];
    const inputs=["idDeltaU",'idDelay',"idDiscrete"];
  //clean previous generated events
  if(graph.eventListeners.length>22){
      graph.eventListeners.pop();graph.eventListeners.pop();
      graph.eventListeners.pop();graph.eventListeners.pop();
      graph.eventListeners.pop();graph.eventListeners.pop();
      graph.eventListeners.pop();graph.eventListeners.pop();
  }
  //redirect to the original model when double click on a clon cell
  graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt){
    let cell = evt.getProperty('cell');
    if (cell!=null){ 
        if(cell.getId().includes("clon")){
            let url = document.URL;
            let n = url.lastIndexOf('/');
            let result_url = url.substring(0,n);
            let originalCellId = cell.getId().substring(4);
            let originalCell = graph.getModel().getCell(originalCellId);
            let parent = originalCell.getParent();
          /* window.location.href = result_url+"/"+parent.getId();*/
           DataContinuous()
          }
          let type = cell.getAttribute("type");
            if (type == "controller") {
              control();
            } 
            if (type == "plant") {
            DataContinuous();
            }
      }
  });

  // modal function
function ModalControl(texts,inputs,default_vals){
  let table = document.createElement('table');
  for (let i=0;i<texts.length;i++) {
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      td.innerHTML=texts[i];
      let input={}
      tr.appendChild(td);
      if (i==1) {
          input = document.createElement('input');
          input.type="checkbox";
          input.id=inputs[i];
      }
      else if (i==2) {
        input = document.createElement('input');
        input.type="checkbox";
        input.id=inputs[i];
      }
      else if (i==3) {
          input = document.createElement('input');
          input.type="checkbox";
          input.innerText=inputs[i];
      } else {  
      input = document.createElement('input');
      input.value=default_vals[i];
      input.type="text";
      input.id=inputs[i];
      input.size=10;
      input.name=inputs[i];
      }
      let td2 = document.createElement('td');
      td2.appendChild(input);
      tr.appendChild(td2);
      table.appendChild(tr);
  }
  return table;
}

  // Modal Identifying transfer function  
    let DataContinuous = function() {
    let header = modalH3(("System model"));
    let body = ModalControl(texts,inputs,default_vals);
    let footer = [];

    footer.push(modalButton("Import Data", function() { 
        UploadData()
    }));
    footer.push(modalButton("Estimate", function(){
      (document.getElementById('idDeltaU').value =="") ?  alert("Incomplete information") : SistemIdentification();
    }));
    setupModal(header, body, footer);  
  }

  function UploadData()
  {
      let hidden = document.getElementById("hidden_elements");
      let input=document.createElement('input');
      input.type="file";
      input.style.display="none";           
      hidden.appendChild(input);
        input.addEventListener('change', function(event) {
        let fileToLoad = input.files[0];
        let fileReader = new FileReader();
          fileReader.onload = function(fileLoadedEvent) {   
                let textload = fileLoadedEvent.target.result;
                localStorage["control_data"]=textload; 
                alert("Successfully stored data");
                alert(textload);
          }
        fileReader.readAsText(fileToLoad, "UTF-8");
        });
      if (input) {
      input.click();
      }  
    }
    function SistemIdentification(){
      let dataList=CollectDataCsv().data;
      dataList =zoomData(dataList)
      let timeList=CollectDataCsv().time;  
      timeList =zoomData(timeList);
      let nuevo=[0];
      let sum=0;
      for(var i=0,j=timeList.length-1;i<j;i++){
        nuevo.push(parseFloat((sum += 0.5).toFixed(2)))
      }
      timeList=nuevo;

      const deltaValue = document.getElementById('idDeltaU').value;
      const idDelay= document.getElementById('idDelay').checked;
      const idDiscrete= document.getElementById('idDiscrete').checked;
      const mainModal = document.getElementById("main_modal_body");
      
    function CollectDataCsv(){
      let text=localStorage["control_data"];
      let allTextLines = text.split(/\r\n|\n/); 
      let listData = [];
      let listTime = [];
      let listSetpoint=[];
      let firstColumn;
      let secondColumn;
      let threeColumn;
            for (let i=0; i<allTextLines.length; i++) {
              firstColumn = allTextLines[i].split(";")[1];
              secondColumn = allTextLines[i].split(";")[0];
              threeColumn = allTextLines[i].split(";")[2];
              if (firstColumn!=null && secondColumn!=null  && threeColumn!=null) {
                listData.push(parseFloat(firstColumn.replace(",", ".")));
                listTime.push(parseFloat(secondColumn.replace(",", ".")));
               listSetpoint.push(parseFloat(threeColumn.replace(",", ".")));
              }
            }
            let dictionaryData = {
              "data": listData,
              "time": listTime,
              "setpoint":listSetpoint,
              listTime:listData,
            };
            return  dictionaryData
          }

    function zoomData(list){
      let sets=CollectDataCsv().setpoint;
      let value=sets[sets.length - 1];  
      var item=  (sets.indexOf(value))-1;
      var masculinos = list.slice(item);

      return masculinos;
    }   
   
    function positionData(){
      let result;
      for (let i=1; i<dataList.length; i++) {   
        if (dataList[i]!=dataList[0]) {  
          result= i-1;
          break;
        } else {
          dataList[0];
        }
      }
      return result;
    }
   
    function ConstantsFirstOrder() {
      let lastData=dataList[dataList.length - 1];
      let firstData=dataList[0];
      let taoData =(((lastData-firstData)*63.2)/100)+firstData;
      let taoData28 =(((lastData-firstData)*28)/100)+firstData;      
      let gain=(lastData-firstData)/ deltaValue;
      let delayValue
      if(positionData()==0){
        delayValue=0
      }else {
      delayValue =timeList[positionData()];
       }
      

      let dictionaryParameters = {
        "taoData": taoData,
        "TaoData28": taoData28,
        "gain": gain,
        "delayValue" : delayValue
      };
      return dictionaryParameters;
    }

    // Search for the nearest number in a list 
    function indexOfClosests(num){
   const d= dataList.reduce((a, b) => {
      return Math.abs(b - num) < Math.abs(a - num) ? b : a;
  });
  return d;    
}


  
// Promedia los valores del eje x que representa el 63% de la salida de una funcion
  function taoValue(){   
    let jarray=[];
    let Smit28=[];
      for (let i=1; i<dataList.length; i++) { 
        if(dataList[i]==indexOfClosests(ConstantsFirstOrder().taoData)) {
          jarray.push(timeList[i])
        
        }
        else if (dataList[i]==indexOfClosests(ConstantsFirstOrder().TaoData28)) {
        Smit28.push(timeList[i])
        }
      }
    let sum = jarray.reduce(function(a,b){
      return a+b
    },0 );
    let sum28 = Smit28.reduce(function(a,b){
      return a+b
    },0 );
    let result={
      "Smith63":sum/jarray.length,
      "Smith28": sum28/Smit28.length
    }
    return result;
  }

    //Curve Fitting//
  function nolinearProcess(){  
    let Pi=Math.PI; let PID2=Pi/2; let Pi2=2*Pi 
    let funcionFirOrder=  "(( "+ConstantsFirstOrder().gain+"  * "+deltaValue +") * (1-Exp( - (t-"+ConstantsFirstOrder().delayValue+" ) / a )))+ D " 
   // let funcionFirOrder=  "(( "+ConstantsFirstOrder().gain+"  * "+deltaValue +") * (1-Exp(  -t/ a )))+ D " 
   
  
    // Basic operations
    function EXP(x) { 
      return Math.exp(x) 
    }
    function Abs(x) { 
      return Math.abs(x)
     }
    function SQRT(x) { 
      return Math.sqrt(x)
    }
    function Fmt(x) { let v;
      if(Abs(x)<0.00005) { x=0 }
        if(x>=0) { 
        v='          '+(x+0.00005) } 
        else {
        v='          '+(x-0.00005) }
      v = v.substring(0,v.indexOf('.')+5)
      return v.substring(v.length-10,v.length)
      }
        
    function StudT(t,n) {
      t=Math.abs(t); let w=t/Math.sqrt(n); let th=Math.atan(w)
      if(n==1) { 
        return 1-th/Pi2 
      }
      let sth=Math.sin(th); let cth=Math.cos(th)
        if((n%2)==1) {
        return 1-(th+sth*cth*StatCom(cth*cth,2,n-3,-1))/PID2 }
        else { 
        return 1-sth*StatCom(cth*cth,1,n-3,-1) 
        }
      }
    
    function StatCom(q,i,j,b) {
        let zz=1; let z=zz; let k=i; 
        while(k<=j) { 
        zz=zz*q*k/(k-b); 
        z=z+zz; k=k+2 
        }
        return z
    }
    
    function AStudT(p,n) { 
      let v=0.5; let dv=0.5; let t=0
        while(dv>1e-6) {
        t=1/v-1; dv=dv/2; 
          if(StudT(t,n)>p) {
          v=v-dv 
          } 
          else { 
          v=v+dv 
          }  
        }
      return t
    }

    function STUDT(t,n) {
      t=Math.abs(t); let w=t/SQRT(n); let th=Math.atan(w)
      if(n==1) {
        return 1-th/PiD2
      }
      let sth=Math.sin(th); let cth=Math.cos(th)
      if((n%2)==1){
        return 1-(th+sth*cth*STATCOM(cth*cth,2,n-3,-1))/PID2
      }
      else {  
        return 1-sth*STATCOM(cth*cth,1,n-3,-1) 
      }
    } 

    function STATCOM(q,i,j,b) {
    let zz=1; let z=zz; let k=i; 
    while(k<=j) { 
      zz=zz*q*k/(k-b); z=z+zz; k=k+2
    }
    return z
    }
  
    function Xlate(s,from,to) { 
      let v = s;
      let l=v.indexOf(from);
      while(l>-1) {
        v = v.substring(0,l) + to + v.substring(l+1,v.length);
        l=v.indexOf(from)
      }
      return v
    }

    function vFmt(x) { 
      let v;
      if(Math.abs(x)<0.0000005) { 
        x=0 
      }
      if(x>=0) {
        v=' '+(x+0.0000005) 
        } else {
        v=' '+(x-0.0000005) 
        }
      v = v.substring(0,v.indexOf('.')+7)
      return v.substring(v.length-18,v.length)
    }

    function createArray() {
      this.length = arguments.length
      for (let i = 0; i < this.length; i++) {
         this[i] = arguments[i] 
      }
    }
            
    function ix(j,k) { 
    return j*(nPar+1)+k 
    }
            
    let Par = new createArray(0,0,0,0,0,0,0,0);
    let SEP = new createArray(1,1,1,1,1,1,1,1);
    let Der = new createArray(0,0,0,0,0,0,0,0,0);
    let Arr = new createArray(0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0);
    let Cov = new createArray(0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0 );
    let xArr = new createArray(0,0,0,0,0,0,0,0,0);
    let CR = unescape("%0D");
    let LF = unescape("%0A");
    let Tb = unescape("%09");
    let NL = CR + LF;

    let i = 0; let j = 0; let k = 0; let l = 0; 

    let nPar = 1;
    let nVar = 1;
    let nPts = (dataList.length)-1;
    let ccSW = 1;
    let ccAv = 0;
    let ccSD = 1;
    let cccSW = 0;
    let cccAv = 0;
    let cccSD = 0;

    let dgfr = nPts - nPar;
    let St95 = AStudT( 0.05 , dgfr );
    let A = taoValue().Smith63;
    
    //cunado la funcion de logaritmo es muy pronunuciada no hay retraso
    /*if(ConstantsFirstOrder().delayValue==0){
      A=1.85;
    }*/
    var D= dataList[0];
    //let A = 74; 
    let P1 = A; Par[0] = A;
    let text=localStorage["control_data"];
    let da = Xlate(text,Tb,";");
    text = da;
    if( da.indexOf(NL)==-1 ) { 
     /* if( da.indexOf(CR)>-1 ) { 
        NL = CR }  
      else { 
        NL = LF } */
        NL = (da.indexOf(CR)>-1) ? NL = CR : NL = LF;    
    }

    let datos=[];
    datos.push(dataList[0]);
    let o = "Y = " + funcionFirOrder  + NL
    for (i=1; i<=nVar; i++) {
          o = o + "     x" + i + "   "       
    }
    o = o + " Y yc Y-yc SEest YcLo YcHi " + NL
    let SSq = 0;
    let w=1;
    let Y;
    for (j = 0; j<nPar*(nPar+1); j++) {
       Arr[j] = 0;
    }
    for (i = 1; i<=nPts; i++) {
      l = da.indexOf(NL);
      let v = da.substring(0,l);
      for (j = 0; j<nVar; j++) {
        l = v.indexOf(";"); 
        if( l==-1 ) { 
          l = v.length 
        };
        xArr[j] = timeList[i];
        o = o + Fmt(xArr[j])
        v = v.substring(l+1,v.length);
      }
    
      let X = xArr[0]; let X1= X
		  X = X1; let T = X;
      let yc = eval( funcionFirOrder.toUpperCase());
      /*if(yc<=0) {
        datos.push(0)
      }
      else {
        datos.push(yc);
      }*/
      (yc<=0) ? datos.push(0) : datos.push(yc);;
      l = v.indexOf(";"); if( l==-1 ) { l = v.length };
      Y = dataList[i]
      v = v.substring(l+1,v.length);
     
  
      let vSEy =1;
      let yTr = "Y"; yTr = yTr.toUpperCase()
      let yT = eval( yTr );
      let ycIncr;

      cccSW = cccSW + 1 / ( w * w );
      cccAv = cccAv + yc / ( w * w );
      cccSD = cccSD + ( Y - ccAv ) * ( Y - ccAv ) / ( w * w );
  
      for (let j=0; j<nPar; j++) {
        let Save = Par[j]; if(Save==0) {var Del = 0.0001} else {var Del = Save/1000}
        Par[j] = Save + Del;
       
        A=Par[0]; 
        P1=A; 
        ycIncr = eval( funcionFirOrder.toUpperCase() )
        Der[j] = ( ycIncr - yc ) / ( Del * w );
        Par[j] = Save;  
        A=Par[0];
        P1=A; 
      }
      Der[nPar] = (Y - yc) / w;
      SSq = SSq + Der[nPar]*Der[nPar];
      for (j=0; j<nPar; j++) {
        for (k=0; k<=nPar; k++) {
          Arr[ix(j,k)] = Arr[ix(j,k)] + Der[j] * Der[k]
        } 
      }

      let SEest = 0;
      for (j=0; j<nPar; j++) {
        SEest = SEest + Cov[ix(j,j)] * Der[j] * Der[j];
        for (k=j+1; k<nPar; k++) {
          SEest = SEest + 2 * Cov[ix(j,k)] * Der[j] * Der[k];
        } 
      }
      SEest=w*SQRT(SEest);
      let yco=yc; let ycl=yc-St95*SEest; let ych=yc+St95*SEest;
      //o = o + (Fmt(yo)+Fmt(yco)+Fmt(yo-yco)+Fmt(SEest)+Fmt(ycl)+Fmt(ych)+NL)
      
    }
    ccSW = cccSW;
    ccAv = cccAv / ccSW;
    ccSD = cccSD / ccSW;
   
    let GenR2 = (ccSD-(SSq/ccSW))/ccSD;
    
    let GenR = SQRT(GenR2);
    
    let RMS = SQRT(SSq/Math.max(1,dgfr));

   /* console.log("Corr. Coeff. = " + vFmt(GenR) + "; r*r = " + vFmt(GenR2))
    console.log( NL + "RMS Error = " + vFmt(RMS) + "; d.f = " + dgfr + "; SSq = " + vFmt(SSq) + NL); */
    localStorage.setItem("coeff",vFmt(GenR));
    localStorage.setItem("RMS",vFmt(RMS));


    for (i=0; i<nPar; i++) { 
      let s = Arr[ix(i,i)]; Arr[ix(i,i)] = 1;
      for (k=0; k<=nPar; k++) { 
        Arr[ix(i,k)] = Arr[ix(i,k)] / s; 
      }
      for (j=0; j<nPar; j++) {
        if (i!=j) {
          s = Arr[ix(j,i)]; Arr[ix(j,i)] = 0;
          for (k=0; k<=nPar; k++) {
            Arr[ix(j,k)] = Arr[ix(j,k)] - s * Arr[ix(i,k)];
          }
        } 
      } 
    }
  
    let FRelax =1
    o = o + ( NL + "Parameter Estimates..." + NL );
    for( i=0; i<nPar; i++) {
      Par[i] = Par[i] + FRelax * Arr[ix(i,nPar)];
      SEP[i] = RMS * SQRT(Arr[ix(i,i)]);
      localStorage.setItem("tao",vFmt(Par[i]));
      o = o + ("p"+(i+1)+"="+vFmt(Par[i])+" +/- "+vFmt(SEP[i])+"; p="+Fmt(STUDT(Par[i]/SEP[i],dgfr))+NL)
    }

  return datos;
  }
    //const tao=1.5*(parseFloat(localStorage.getItem("tao"))-taoValue().Smith28);
    const tao=parseFloat(localStorage.getItem("tao"));
    const gain=ConstantsFirstOrder().gain;
    localStorage.setItem("gain",gain);
    //const delay= taoValue().Smith63 -tao;
    const delay= ConstantsFirstOrder().delayValue;

    function parametersZiegler() {
      let parameter={
        "Kp": Math.abs( 1.2*(tao/(gain*delay))),
        "Ti": Math.abs(2*delay),
        "Td":Math.abs(0.5*delay)    
      }
      localStorage.setItem("zieglerkp",parameter.Kp);
      localStorage.setItem("zieglerti",parameter.Ti);
      localStorage.setItem("zieglertd",parameter.Td);
      return parameter;
    }

    function parametersCohen() {
      let parameter={
        "Kp": Math.abs((1.35/gain)*((tao/delay)+0.185)),
        "Ti": Math.abs((2.5*delay) *((tao+0.185*delay)/(tao+0.611*delay))),
        "Td":Math.abs(0.370 *(tao/(tao+0.185*delay)))    
      }
      localStorage.setItem("cohenkp",parameter.Kp);
      localStorage.setItem("cohenti",parameter.Ti);
      localStorage.setItem("cohentd",parameter.Td);
      return parameter;
    }

    function parametersAmigo() {
      let parameter={
        "Kp": Math.abs((1/gain)*(0.2+0.45*(tao/delay))),
        "Ti": Math.abs(((0.4*delay+0.8*tao)/(delay+0.1*tao))),
        "Td":Math.abs(((0.5 *tao)/((0.3*delay)+tao))*delay)   
      }
      localStorage.setItem("amigokp",parameter.Kp);
      localStorage.setItem("amigoti",parameter.Ti);
      localStorage.setItem("amigotd",parameter.Td);
      return parameter;
    }

    function Transformz() {
      let parameter={
        "qo": parametersZiegler().Kp*(1+(1/(2*parametersZiegler().Ti))+(parametersZiegler().Td/1)),
        "q1": - parametersZiegler().Kp*(1-(1/(2*parametersZiegler().Ti))+((parametersZiegler().Td*2)/1)),
        "q2":(parametersZiegler().Kp*parametersZiegler().Td )/1  
      }
      return parameter;

    }
    function updateEdge(){
      let ControlRoot = graph.getModel().getCell("control");
			let ControlEdges = graph.getModel().getChildVertices(ControlRoot);
			for (let i = 0; i < ControlEdges.length; i++) {
				let source = ControlEdges[i];
        let type = source.getAttribute("type");
				if(type == "controller"){
          source.setAttribute("Proportional",parametersZiegler().Kp.toFixed(2))
          source.setAttribute("Integral",parametersZiegler().Ti.toFixed(2))
          source.setAttribute("Derivate",parametersZiegler().Td.toFixed(2))
        }
      }
    }
    
    function canvasGraph (titleHeader,labels,datacsv,output){
      updateEdge();
      let header = modalH3(titleHeader);
      let body=""
      let footer = modalButton(("return"),function(){DataContinuous();}) 
      setupModal(header,body,footer);
      let transferFuncion; 
      localStorage.setItem("tiempos",timeList);

      if(idDelay==true && idDiscrete==false ) {
        transferFuncion="Gp(s) = \\frac{"+ gain.toFixed(2)+"* e^-"+ delay+"s}{"+tao.toFixed(2)+"s  "+"  +1}"
      }
      else if (idDelay==false && idDiscrete==false) {
        transferFuncion="Gp(s) = \\frac{"+ gain.toFixed(2)+"s}{"+tao.toFixed(2)+"s  "+"  +1}"
      }
      if(idDiscrete==true){
        transferFuncion="D(z) = \\frac{"+ Transformz().qo.toFixed(2)+" z^2"+" " +Transformz().q1.toFixed(2)+" z" +" + "+ 
        Transformz().q2.toFixed(2)+"}{"+"z"+"(z-1)"+"}"
      }

      var DataDisplay = [transferFuncion,"Ziegler–Nichols:  K:"+ parametersZiegler().Kp.toFixed(2)+"\\"+"   " +
      " Ti:"+ parametersZiegler().Ti.toFixed(2)+" "+" Td:"+ parametersZiegler().Td.toFixed(2)+" ",
      "Cohen-Coon:  K:"+ parametersCohen().Kp.toFixed(2)+"\\"+"   " +
      " Ti:"+ parametersCohen().Ti.toFixed(2)+" "+" Td:"+ parametersCohen().Td.toFixed(2)+" ",
      "Amigo:  K:"+ parametersAmigo().Kp.toFixed(2)+"   " +
      " Ti:"+ parametersAmigo().Ti.toFixed(2)+" "+" Td:"+ parametersAmigo().Td.toFixed(2),
        ];
       DataDisplay.forEach(myFunction);

     function myFunction(item, index) {
          let transferFunction=  document.createElement("div");
          mainModal.appendChild(transferFunction);
          transferFunction.id=index;
          transferFunction.style.height = "23px";
          transferFunction.innerHTML = "\\["+item+"\\]";
          MathJax.Hub.Queue(["Typeset",MathJax.Hub,transferFunction]);
          }


      let canvas = document.createElement("canvas");
      canvas.id = "myChart";
      canvas.width = 500;
      canvas.height = 250;
      canvas.className = "my-4 chartjs-render-monitor";
      mainModal.appendChild(canvas);
      let ctx = document.getElementById("myChart");
      let myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              data: datacsv,//setInterval(function(){ UploadData(); }, 3000),
              label: "Data Plant",
              lineTension: 0,
              backgroundColor: "transparent",
              borderColor: "#D83A18",
              borderWidth: 2,
              pointBackgroundColor: "#D83A18",
              pointBorderColor: "transparent",
              pointBackgroundColor: "transparent",
              pointBorderWidth: 0
            },
            {
              data: output,
              label: "Data Transfer Function",
              lineTension: 0,
              backgroundColor: "transparent",
              borderColor: "#007bff",
              borderWidth: 2,
              pointBackgroundColor: "#007bff",
              pointBorderColor: "transparent",
              pointBackgroundColor: "transparent",
              pointBorderWidth: 0
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: ['Corr. Coeff :'+localStorage.getItem("coeff")/*+'  RMS :'+localStorage.getItem("RMS")*/],
          },
        }
      });
      return setupModal;
      }

    return canvasGraph("Experimental Result",timeList,dataList,nolinearProcess());
  }
          
  function controlllerOutput(){
    let tiemposlocal=[];
    tiemposlocal=localStorage.getItem("tiempos")
    var bx = tiemposlocal.split(',').map(function(item) {
      return parseFloat(item);
    });
   
    let error;
    let errorant=0;
    let error_acum=0;
    let sp=1;
    let tm=1000;
    let controlador=0;
    //let a=-Math.exp(-1/parseFloat(localStorage.getItem("tao")));
    //let b=parseFloat(localStorage.getItem("gain"))*(1+a);
    let a=-Math.exp(-1/2.3)
            let b=(1.32)*(1+a)
    let output=(0.52)*(1-Math.exp(-1/2))
    let controladores =[];
    let salidap=0;
    let salidas=[];
    let tiempos=[];
    let setpoints=[];

   
    for (let i = 0; i < 200; i++) {
      (i<1) ? salidap=0 : salidap=parseFloat((controladores[i-1]*b-(a*salidap)));
        error=sp-salidap;
        error_acum=error_acum+parseFloat(error);
        controlador=(0.1*error)+(error_acum*(1/parseFloat(localStorage.getItem("zieglerti"))))+(0*(errorant-error));
        controladores.push(controlador);
        tiempos.push(i);
        salidas.push(salidap);
        setpoints.push(sp);
    }
    let param={
      "time":tiempos,
      "output":salidas,
      "setpoint":setpoints
    }
  return param;
}

    function control(){
      const mainModal = document.getElementById("main_modal_body");
      let header = modalH3("test");
      let body=""
      let footer = modalButton(("return"),function(){DataContinuous();}) 
      setupModal(header,body,footer);
      let canvas = document.createElement("canvas");
      canvas.id = "myChart";
      canvas.width = 500;
      canvas.height = 250;
      canvas.className = "my-4 chartjs-render-monitor";
      mainModal.appendChild(canvas);
      let ctx = document.getElementById("myChart");
      let myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: controlllerOutput().time,
          datasets: [
            {
              data: controlllerOutput().output,//setInterval(function(){ UploadData(); }, 3000),
              label: "Step Response",
              lineTension: 0,
              backgroundColor: "transparent",
              borderColor: "#D83A18",
              borderWidth: 2,
              pointBackgroundColor: "#D83A18",
              pointBorderColor: "transparent",
              pointBackgroundColor: "transparent",
              pointBorderWidth: 0
            },
            {
              data: controlllerOutput().setpoint,
              label: "Setpoint",
              lineTension: 0,
              backgroundColor: "transparent",
              borderColor: "#007bff",
              borderWidth: 2,
              pointBackgroundColor: "#007bff",
              pointBorderColor: "transparent",
              pointBackgroundColor: "transparent",
              pointBorderWidth: 0
            }
          ]
        },
        options: {
          title: {
            display: true,
          },
        }
      });
      return setupModal;
      }

  let controlAction = findControlAction(graph)
  HideControlElements(graph, controlAction);
  function findControlAction(graph){
    //se busca el control action en la url
    // let url = document.URL;  
    // let captured = /controlAction=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
    // let controlAction = captured ? captured : 'myDefaultValue'; 
 
    //se busca el controlaction en el local storage y si no existe se muestra el primero
    let controlActionLS = localStorage['adaptation_binding_state_hardware_controlAction']; 
    let controlAction = "asdf";
    let feedbackRoot = graph.getModel().getCell("control");
    let childs = graph.getModel().getChildVertices(feedbackRoot); 
    for (let i = 0; i < childs.length; i++) {
      if (childs[i].getAttribute("type") == "controlAction") {
        controlAction=childs[i].getAttribute("label");
        if (childs[i].getAttribute("label") == controlActionLS) {
          break;
        }
      }
    } 
    return controlAction;
  };

  function HideControlElements(graph, controlActionLabel){
      //alert('escondiendo elementos ' + controlActionLabel);
     let namesControlAction = [];
     let targetSystemId; // target system id
     let targetSystemRelations; // relations target system
     // controller variables
     let id_controller;// controller id
     let controllerRelations; // controller relations
     let ControllerInnerId;
     let controllerInnerRelations;
     // summing point variables
     let summingID; // summing point id
     let summingRelations; // summing relations
     let initialSummingID; // summing initial id
     let summingRelationsTwo;
     let summingPlantID // id summing plant
     // filter variables
     let filterID; // filter relations
     let filterRelations;
     // set point variables
     let setpointID;// id setpoint
     // branch variables
     let branchID// id Branchpoint
     let finalBranchID
     let branchRelationsTarget// target relations Branchpoint
     let branchRelations// source relations Branchpoint
    let finalBranchRelations// source relations Branchpoint
     // output variables
     let outputID// id output
     // transducer variables
     let transducerID// id transducer
     let transdurcerRelations// transducer relations
     // list elements
     let listElements=[];
     let feedbackRoot = graph.getModel().getCell("control");
     let childs = graph.getModel().getChildVertices(feedbackRoot);
     //navigates through the feature model childsld
     for (let i = 0; i < childs.length; i++) {
        if (childs[i].getAttribute("type") == "controlAction") {
         let target_sys = childs[i].getAttribute("label");
         namesControlAction.push(target_sys)
        }
     }
     for (let i = 0; i < namesControlAction.length; i++) {
        if ( controlActionLabel== namesControlAction[i]) {
          for (let i = 0; i < childs.length; i++) {
            if (childs[i].getAttribute("type") == "controlAction") {
                    //only selected concrete features are analyzed
              if (childs[i].getAttribute("label")== controlActionLabel) {
                     targetSystemId = childs[i].getId(); 
                     listElements.push(targetSystemId);
              }                 
            }   
           }

          targetSystemRelations = graph.getModel().getIncomingEdges
          (graph.getModel().getCell(targetSystemId));
          for (let i = 0; i < targetSystemRelations.length; i++) {
            let source = targetSystemRelations[i].source;    
            if (source.getAttribute("type")=="controller") {   
              ControllerInnerId= source.getId();
              listElements.push(id_controller);  
            } else if (source.getAttribute("type")=="summingPoint") { 
              summingPlantID = source.getId();
              listElements.push(summingID);     
            }
          }

          controllerInnerRelations = graph.getModel().getIncomingEdges
          (graph.getModel().getCell(summingPlantID));
          for (let i = 0; i < controllerInnerRelations.length; i++) {
            let source = controllerInnerRelations[i].source;
            if (source.getAttribute("type")=="controller") { 
              ControllerInnerId= source.getId();
              listElements.push(id_controller);    
            }   
          }
          
          controllerInnerRelations = graph.getModel().getIncomingEdges
          (graph.getModel().getCell(ControllerInnerId));
          for (let i = 0; i < controllerInnerRelations.length; i++) {
              let source = controllerInnerRelations[i].source;
              if (source.getAttribute("type")=="summingPoint") {
                summingID = source.getId();
                listElements.push(summingID);   
              }  
            }
        
          summingRelations = graph.getModel().getIncomingEdges
          (graph.getModel().getCell(summingID));
          for (let i = 0; i < summingRelations.length; i++) {
              let source = summingRelations[i].source;
              if(source.getAttribute("type")=="filter") {
                filterID = source.getId(); 
                listElements.push(filterID); 
              } else if (source.getAttribute("type")=="branchpoint") { 
                finalBranchID = source.getId(); 
              } else if(source.getAttribute("type")=="controlAction") { 
                targetSystemId = source.getId();  
              } else if(source.getAttribute("type")=="controller") {
                id_controller = source.getId();
              }  else if(source.getAttribute("type")=="setpoint") { 
                setpointID = source.getId(); 
                listElements.push(setpointID); 
              } else if(source.getAttribute("type")=="transducer") { 
               transducerID=source.getId();  
              }   
          }
           
          controllerRelations =  graph.getModel().getIncomingEdges
          ( graph.getModel().getCell(id_controller));
          for (let i = 0; i < controllerRelations.length; i++) {
            let source = controllerRelations[i].source;
            if (source.getAttribute("type")=="summingPoint") {
              initialSummingID = source.getId(); 
              listElements.push(initialSummingID);
             }
          }

          summingRelationsTwo =  graph.getModel().getIncomingEdges
          (graph.getModel().getCell(initialSummingID));
          for (let i = 0; i < summingRelationsTwo.length; i++) {
            let source = summingRelationsTwo[i].source; 
            if (source.getAttribute("type")=="setpoint") { 
              setpointID = source.getId(); 
              listElements.push(setpointID); 
            } else if (source.getAttribute("type")=="filter") {
              filterID = source.getId(); 
              listElements.push(filterID); 
            } else if (source.getAttribute("type")=="branchpoint") { 
              finalBranchID = source.getId();  
            } else if(source.getAttribute("type")=="transducer") { 
              transducerID = source.getId(); 
            } 
          }
              
          filterRelations =  graph.getModel().getIncomingEdges
          ( graph.getModel().getCell(filterID));
          for (let i = 0; i < filterRelations.length; i++) {
            let source = filterRelations[i].source;
            if (source.getAttribute("type")=="branchpoint") {
              finalBranchID = source.getId(); 
              listElements.push(branchID); 
            } else if (source.getAttribute("type")=="transducer") {
              transducerID = source.getId();
              listElements.push(branchID); 
            }   
          }
        
          transdurcerRelations =  graph.getModel().getIncomingEdges
          ( graph.getModel().getCell(transducerID));
          for (let i = 0; i < transdurcerRelations.length; i++) {
              let source = transdurcerRelations[i].source;
            if(source.getAttribute("type")=="branchpoint") {
              finalBranchID = source.getId(); 
              listElements.push(branchID); 
            }    
          }
  
          branchRelationsTarget =graph.getModel().getOutgoingEdges
          (graph.getModel().getCell(finalBranchID));
          for (let i = 0; i < branchRelationsTarget.length; i++) {
            let target = branchRelationsTarget[i].target;
            if(target.getAttribute("type")=="outputSystem") {
              outputID= target.getId();
              listElements.push(outputID); 
            }
          }

          finalBranchRelations =graph.getModel().getIncomingEdges
          (graph.getModel().getCell(finalBranchID));
          for (let i = 0; i < finalBranchRelations.length; i++) {
            let source = finalBranchRelations[i].source;
            if(source.getAttribute("type")=="branchpoint") {
              branchID= source.getId();
              listElements.push(branchID); 
             }
          }

          branchRelations = graph.getModel().getIncomingEdges
          (graph.getModel().getCell(branchID));
          for (let i = 0; i < branchRelations.length; i++) {
            let source = branchRelations[i].source;
            if(source.getId() == targetSystemId && source.getAttribute("type")=="controlAction") {
              finalID=source.getId();
            }
          }
           
          let feedbackRoot = graph.getModel().getCell("control");
          let childs2 = graph.getModel().getChildVertices(feedbackRoot);
          for (let i = 0; i < childs2.length; i++) {
            if (
              childs2[i].getId() != targetSystemId &&
              childs2[i].getId() != summingID &&
              childs2[i].getId() != setpointID &&
              childs2[i].getId() != filterID &&
              childs2[i].getId() != id_controller &&
              childs2[i].getId() != branchID &&
              childs2[i].getId() != outputID &&
              childs2[i].getId() != ControllerInnerId &&
              childs2[i].getId() != initialSummingID &&
              childs2[i].getId() != finalBranchID &&
              childs2[i].getId() != transducerID &&
              childs2[i].getId() != summingPlantID ) {
              graph.getModel().setVisible(childs2[i], false);
            } else {
            graph.getModel().setVisible(childs2[i], true)
            }
          }
        }
      }
    };
  }
export default setupEvents