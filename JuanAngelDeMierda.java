
import javax.swing.JOptionPane;



public class JuanAngelDeMierda{
   public static void main(String[] args) {
      int x = 1;
      float z = 0;
       while ( x  < 4 ) {
        x++;
        float y = Float.parseFloat(JOptionPane.showInputDialog(null , "Introduce un número decimal:"));
        int p = (int) y;
        if ( y % p  == 0 ) { 
            JOptionPane.showMessageDialog(null, "Tienes que dar un número decimal, no entero");
            break;
        }
        int v  = Integer.parseInt(JOptionPane.showInputDialog(null , "Introduce un número entero:"));
        z += v + y;

       }
       JOptionPane.showMessageDialog(null, "El resultado es: " + z);
   }
}

