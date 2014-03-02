
import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;

public class PostgresSample {


	public static void main(String[] args){


		try {
			Class.forName("org.postgresql.Driver");
		} catch(ClassNotFoundException e){
			System.out.println("Library not found.");
		}
		

		Connection con = null;
		String host = "127.0.0.1", port = "5432", dbname = "mydbname", username = "scalaberch", password = "markieth";
		String connectionString = "jdbc:postgresql://"+host+":"+port+"/"+dbname;
		try {
			con = DriverManager.getConnection(connectionString, username, password);
		} catch(SQLException e){
			System.out.println("SQL Error.");
			e.printStackTrace();
		}


		if (con != null){
			System.out.println("Connection active...");
		} else { System.out.println("Not connected...."); }


		// Calling a fixed SQL Query (without parameters)
		Statement st = db.createStatement();
		ResultSet rs = st.executeQuery("SELECT * FROM mytable WHERE columnfoo = 500");
		while (rs.next()) {
		    System.out.print("Column 1 returned ");
		    System.out.println(rs.getString(1));
		}
		rs.close(); // always close
		st.close(); // always close

		// Calling a parameterized SQL Query...
		int foovalue = 500;
		PreparedStatement st = db.prepareStatement("SELECT * FROM mytable WHERE columnfoo = ?");
		st.setInt(1, foovalue);
		
		ResultSet rs = st.executeQuery();
		while (rs.next()) {
		    System.out.print("Column 1 returned ");
		    System.out.println(rs.getString(1));
		}
		rs.close();
		st.close();

		// Close the databse
		con.close();


	}



}