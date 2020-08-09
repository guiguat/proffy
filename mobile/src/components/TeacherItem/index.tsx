import React from "react";
import { View, Text, Image } from "react-native";
import styles from "./styles";
import heartOutlineIcon from "../../assets/images/icons/heart-outline.png";
import unfavoriteIcon from "../../assets/images/icons/unfavorite.png";
import whatsappIcon from "../../assets/images/icons/whatsapp.png";
import { RectButton } from "react-native-gesture-handler";

const TeacherItem: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          style={styles.avatar}
          source={{ uri: "https://github.com/guiguat.png" }}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Guilherme Guatura</Text>
          <Text style={styles.subject}>Informática</Text>
        </View>
      </View>
      <Text style={styles.bio}>
        16 yro software development student at COTIL - UNICAMP and design
        enthusiast
      </Text>
      <View style={styles.footer}>
        <Text style={styles.price}>
          Preço/hora {"   "}
          <Text style={styles.priceValue}>R$ 20,00</Text>
        </Text>
        <View style={styles.buttonsContainer}>
          <RectButton style={styles.favoriteButton}>
            <Image source={heartOutlineIcon} />
          </RectButton>
          <RectButton style={styles.contactButton}>
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>
    </View>
  );
};

export default TeacherItem;
