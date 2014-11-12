<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/sql" prefix="sql"%>
<!DOCTYPE html>
<html lang="en">
<head>
<head>
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Bootstrap 3, from LayoutIt!</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="">
  <meta name="author" content="">

	<!--link rel="stylesheet/less" href="less/bootstrap.less" type="text/css" /-->
	<!--link rel="stylesheet/less" href="less/responsive.less" type="text/css" /-->
	<!--script src="js/less-1.3.3.min.js"></script-->
	<!--append ‘#!watch’ to the browser URL, then refresh the page. -->
	
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/style.css" rel="stylesheet">

  <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
  <!--[if lt IE 9]>
    <script src="js/html5shiv.js"></script>
  <![endif]-->

  <!-- Fav and touch icons -->
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/apple-touch-icon-144-precomposed.png">
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/apple-touch-icon-114-precomposed.png">
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/apple-touch-icon-72-precomposed.png">
  <link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon-57-precomposed.png">
  <link rel="shortcut icon" href="img/favicon.png">
  
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/scripts.js"></script>
    <title>JSP Page</title>
</head>

<body>
<% 
request.setCharacterEncoding("UTF-8");
response.setCharacterEncoding("UTF-8");
%>
<div class="container">
	<div class="row clearfix">
		<div class="col-md-12 column">
        
   
            <center><img alt="HereVGo"src="img/LogoProject.jpg" width="30%"></center>
			<form role="form" id="1517290096" accept-charset="UTF-8" method="post">
				<div class="form-group">
					 <label>ค้นหาข้อมูลการเดินทาง</label>
                     <c:choose>
                      <c:when test="${param.findBtn == null}">
                        <input name="place" class="form-control" placeholder="ใส่จุดหมายปลายทางของคุณ">
                      </c:when>
                    <c:otherwise>
                        <input name="place" class="form-control" value="${param.place}" placeholder="ใส่จุดหมายปลายทางของคุณ">
                    </c:otherwise>
                    </c:choose>
				</div>
                <button type="submit" name="findBtn" class="btn btn-default">ค้นหา</button>
			</form>
            <c:choose>
                      <c:when test="${param.findBtn != null}">
                      
                    
            <sql:setDataSource var = "datasource" driver="com.microsoft.sqlserver.jdbc.SQLServerDriver" url="jdbc:sqlserver://l8kkrvom6f.database.windows.net;databaseName=herevgodb;user=zanels@l8kkrvom6f.database.windows.net;password=Rm97e8sA"/>
        <sql:query var="db" dataSource="${datasource}">
           SELECT * FROM dbo.hvg_route INNER JOIN dbo.hvg_places
ON dbo.hvg_route.place_id=dbo.hvg_places.place_id WHERE dbo.hvg_places.name LIKE '%${param.place}%';
        </sql:query>
       
			<table class="table">
				<thead>
					<tr>
                    <th>
						    จุดเริ่มต้น
						</th>
						<th>
						    ปลายทาง
						</th>
						<th>
							การเดินทาง
						</th>
						<th>
							ค่าใช้จ่าย (บาท)
						</th>
					</tr>
				</thead>
				<tbody>
                 <c:forEach var="row" items="${db.rows}">
                <tr class="warning">

						<td>
							${row.origin}
						</td>
						<td>
							${row.name}
						</td>
						<td>
							${row.route}
						</td>
						<td>
							${row.total_cost}
						</td>
					</tr>
                </c:forEach>
					
					
				</tbody>
			</table>
              </c:when>
              </c:choose>
		</div>
	</div>
</div>
</body>
</html>
